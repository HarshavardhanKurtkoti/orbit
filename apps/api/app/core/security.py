import time
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Union
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

# High-performance in-memory cache to eliminate repetitive round-trips to Neon PostgreSQL
_USER_CACHE: dict[str, tuple[float, Any]] = {}
_WORKSPACE_ACCESS_CACHE: dict[tuple[str, str], tuple[float, Any]] = {}
CACHE_TTL = 45.0  # seconds


def invalidate_user_cache(user_id: Optional[str] = None):
    if user_id:
        _USER_CACHE.pop(user_id, None)
    else:
        _USER_CACHE.clear()


def invalidate_workspace_access_cache(workspace_id: Optional[str] = None):
    if workspace_id:
        to_del = [k for k in _WORKSPACE_ACCESS_CACHE if k[0] == workspace_id]
        for k in to_del:
            _WORKSPACE_ACCESS_CACHE.pop(k, None)
    else:
        _WORKSPACE_ACCESS_CACHE.clear()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8")[:72],
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode("utf-8")[:72], salt).decode("utf-8")


def create_access_token(
    subject: Union[str, Any],
    extra_claims: Optional[Dict[str, Any]] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode: Dict[str, Any] = {
        "exp": expire,
        "sub": str(subject),
        "type": "access",
        "iat": datetime.now(timezone.utc)
    }
    if extra_claims:
        to_encode.update(extra_claims)
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(
    subject: Union[str, Any],
    extra_claims: Optional[Dict[str, Any]] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode: Dict[str, Any] = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
        "iat": datetime.now(timezone.utc)
    }
    if extra_claims:
        to_encode.update(extra_claims)
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


async def get_current_user_optional(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not token:
        return None
    try:
        payload = decode_token(token)
        raw_sub = payload.get("sub")
        if not raw_sub or not isinstance(raw_sub, str):
            return None
        user_id: str = raw_sub
    except jwt.PyJWTError:
        return None
        
    from app.models.user import User
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    return user


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = decode_token(token)
        raw_sub = payload.get("sub")
        token_type = payload.get("type", "access")
        if not raw_sub or not isinstance(raw_sub, str) or token_type != "access":
            raise credentials_exception
        user_id: str = raw_sub
    except jwt.PyJWTError:
        raise credentials_exception
        
    now = time.time()
    cached = _USER_CACHE.get(user_id)
    if cached and (now - cached[0] < CACHE_TTL):
        user = cached[1]
    else:
        from app.models.user import User
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user is not None:
            _USER_CACHE[user_id] = (now, user)

    if user is None:
        raise credentials_exception
    if user.status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended"
        )
    return user


async def require_admin(
    current_user = Depends(get_current_user)
):
    if current_user.role not in ("admin", "owner"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


async def verify_workspace_access(
    workspace_id: str,
    user_id: str,
    db: AsyncSession
) -> bool:
    now = time.time()
    cache_key = (workspace_id, user_id)
    cached = _WORKSPACE_ACCESS_CACHE.get(cache_key)
    if cached and (now - cached[0] < CACHE_TTL):
        return True

    from app.models.workspace import Workspace, WorkspaceMember
    query = (
        select(Workspace.id)
        .join(WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id)
        .where(Workspace.id == workspace_id, WorkspaceMember.user_id == user_id)
    )
    result = await db.execute(query)
    found_id = result.scalar_one_or_none()
    if not found_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have access to this workspace",
        )
    _WORKSPACE_ACCESS_CACHE[cache_key] = (now, True)
    return True
