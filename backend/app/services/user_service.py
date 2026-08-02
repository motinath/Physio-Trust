from sqlalchemy.orm import Session
from backend.app.db.models import User
from typing import List, Optional


def get_or_create_user(db: Session, subject_id: str, name: str = "Anonymous Subject", age: int = 30, gender: str = "unspecified") -> User:
    user = db.query(User).filter(User.subject_id == subject_id).first()
    if not user:
        user = User(subject_id=subject_id, name=name, age=age, gender=gender, baseline_variance=0.0)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def list_users(db: Session) -> List[User]:
    users = db.query(User).all()
    if not users:
        # Seed initial Subject 100
        default_user = get_or_create_user(db, subject_id="100", name="MIT-BIH Subject 100", age=69, gender="male")
        return [default_user]
    return users


def update_user_baseline(db: Session, subject_id: str, baseline_variance: float) -> Optional[User]:
    user = db.query(User).filter(User.subject_id == subject_id).first()
    if user:
        user.baseline_variance = baseline_variance
        db.commit()
        db.refresh(user)
    return user
