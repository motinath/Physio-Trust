from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.modules.patients.schema import UserCreate, UserResponse, ProfileResponse
from backend.app.modules.patients.service import list_users, get_or_create_user
from physiotrust.ai.memory.profile import get_default_user_profile

router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return list_users(db)


@router.post("/users", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return get_or_create_user(
        db,
        subject_id=user_in.subject_id,
        name=user_in.name,
        age=user_in.age,
        gender=user_in.gender
    )


@router.get("/users/{subject_id}", response_model=UserResponse)
def get_user_by_subject(subject_id: str, db: Session = Depends(get_db)):
    return get_or_create_user(db, subject_id=subject_id)



@router.get("/profile", response_model=ProfileResponse)
def get_user_profile(subject_id: str = "100"):
    profile = get_default_user_profile(subject_id=subject_id)
    return ProfileResponse(**profile.to_dict())
