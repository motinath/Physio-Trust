from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.db.models import User


class UserRepository:
    """
    Data Access Layer (Repository pattern) for User ORM operations.
    """

    @staticmethod
    def get_by_subject_id(db: Session, subject_id: str) -> Optional[User]:
        return db.query(User).filter(User.subject_id == subject_id).first()

    @staticmethod
    def list_all(db: Session) -> List[User]:
        return db.query(User).all()

    @staticmethod
    def create(db: Session, subject_id: str, name: str = "Anonymous Subject", age: int = 30, gender: str = "unspecified") -> User:
        user = User(subject_id=subject_id, name=name, age=age, gender=gender)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
