from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List, Optional


class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    avatar_url: Optional[str] = None
    role: str = "member"
    status: str = "active"


class UserRegister(BaseModel):
    email: EmailStr
    display_name: str
    password: str
    avatar_url: Optional[str] = None
    role: str = "member"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserCreate(BaseModel):
    email: EmailStr
    display_name: str
    password: str
    role: str = "member"
    status: str = "active"
    avatar_url: Optional[str] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    password: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 60 * 60 * 24 * 7  # seconds
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


class UsersListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    page: int
    page_size: int
