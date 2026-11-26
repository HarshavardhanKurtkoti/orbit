from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import jwt

from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
    get_current_user,
)
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember
from app.schemas.auth import (
    Token,
    UserLogin,
    UserRegister,
    UserResponse,
    RefreshTokenRequest,
)

router = APIRouter()


@router.post("/register", response_model=Token)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )
    
    user = User(
        email=user_in.email,
        display_name=user_in.display_name,
        password_hash=get_password_hash(user_in.password),
        avatar_url=user_in.avatar_url,
        role=user_in.role or "member",
        status="active",
    )
    db.add(user)
    await db.flush()

    # Automatically create default workspace for user
    workspace = Workspace(
        owner_id=user.id,
        name=f"{user.display_name}'s Universe",
        description="Personal spatial workspace",
        settings={"theme": "space-dark", "layout": "spatial"},
    )
    db.add(workspace)
    await db.flush()

    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=user.id,
        role="owner",
    )
    db.add(member)
    
    extra = {"email": user.email, "role": user.role}
    access_token = create_access_token(subject=user.id, extra_claims=extra)
    refresh_token = create_refresh_token(subject=user.id, extra_claims=extra)
    user.refresh_token = refresh_token

    await db.commit()
    await db.refresh(user)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    if not user or not user.password_hash or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if user.status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been suspended. Please contact your administrator.",
        )

    extra = {"email": user.email, "role": user.role}
    access_token = create_access_token(subject=user.id, extra_claims=extra)
    refresh_token = create_refresh_token(subject=user.id, extra_claims=extra)
    user.refresh_token = refresh_token
    await db.commit()
    await db.refresh(user)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.post("/demo", response_model=Token)
async def demo_login(db: AsyncSession = Depends(get_db)):
    # Auto-login or create default demo user
    result = await db.execute(select(User).where(User.email == "commander@orbit.internal"))
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(
            email="commander@orbit.internal",
            display_name="Orbit Commander",
            password_hash=get_password_hash("orbit2026!"),
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
            role="admin",
            status="active",
        )
        db.add(user)
        await db.flush()

        workspace = Workspace(
            owner_id=user.id,
            name="Command Universe",
            description="Default spatial operations workspace",
            settings={"theme": "space-dark", "layout": "spatial"},
        )
        db.add(workspace)
        await db.flush()

        member = WorkspaceMember(
            workspace_id=workspace.id,
            user_id=user.id,
            role="owner",
        )
        db.add(member)
    else:
        # Ensure demo user has admin role
        if user.role != "admin":
            user.role = "admin"

    extra = {"email": user.email, "role": user.role}
    access_token = create_access_token(subject=user.id, extra_claims=extra)
    refresh_token = create_refresh_token(subject=user.id, extra_claims=extra)
    user.refresh_token = refresh_token
    await db.commit()
    await db.refresh(user)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(payload: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        decoded = decode_token(payload.refresh_token)
        user_id: str = decoded.get("sub")
        token_type: str = decoded.get("type")
        if not user_id or token_type != "refresh":
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise credentials_exception
    if user.status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended",
        )

    extra = {"email": user.email, "role": user.role}
    new_access = create_access_token(subject=user.id, extra_claims=extra)
    new_refresh = create_refresh_token(subject=user.id, extra_claims=extra)
    user.refresh_token = new_refresh
    await db.commit()
    await db.refresh(user)

    return Token(
        access_token=new_access,
        refresh_token=new_refresh,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    current_user.refresh_token = None
    await db.commit()
    return {"status": "ok", "message": "Session invalidated successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
