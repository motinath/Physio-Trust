from fastapi import APIRouter
from physiotrust.auth.jwt import JWTAuthManager

router = APIRouter()


@router.post("/auth/login")
def login_internal_user(subject_id: str = "100", role: str = "Researcher"):
    token = JWTAuthManager.create_access_token(subject_id=subject_id, role=role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "subject_id": subject_id,
        "role": role,
        "message": f"Authenticated successfully as {role}"
    }
