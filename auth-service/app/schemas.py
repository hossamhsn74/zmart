import uuid
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: uuid.UUID
    email: EmailStr
    name: str
    preferences: Optional[Dict] = {}
    segments: Optional[List[str]] = []

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
