from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .db import get_db
from .models import User
from .schemas import UserCreate, UserLogin, UserResponse, Token
from .utils import create_access_token

router = APIRouter(tags=["Auth"])


# Register endpoint
@router.post("/signup", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        name=user.name,
        hashed_password=user.password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token_payload = {
        "sub": str(db_user.user_id),
        "email": db_user.email,
    }
    access_token = create_access_token(token_payload)

    return {
        "accessToken": access_token,
        "user": {
            "id": str(db_user.user_id),
            "name": db_user.name,  # make sure this field exists in your User model
            "email": db_user.email,
        },
    }
