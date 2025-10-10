from sqlalchemy import Column, String, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import uuid
from .db import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    preferences = Column(JSON, default={})
    segments = Column(ARRAY(String), default=[])
