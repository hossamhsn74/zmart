from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .db import get_db
from .models import User
from .schemas import UserCreate, UserLogin, UserResponse, Token
from .utils import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# Register endpoint
@router.post("/register", response_model=UserResponse)
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


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user by email & password.
    Returns a JWT access token if credentials are valid.
    """
    # 1️⃣ Find the user
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    # 3️⃣ Create JWT token
    token_payload = {
        "sub": str(db_user.user_id),
        "email": db_user.email,
        # "iat": datetime.utcnow(),  # issued at
    }
    access_token = create_access_token(token_payload)

    # 4️⃣ Return token
    return {"access_token": access_token, "token_type": "bearer"}
