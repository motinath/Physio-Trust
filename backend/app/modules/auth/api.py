from fastapi import APIRouter

router = APIRouter()


@router.post("/auth/login")
def login_internal_user(subject_id: str = "100", role: str = "Researcher"):
    return {
        "access_token": "bearer-token-open-access",
        "token_type": "bearer",
        "subject_id": subject_id,
        "role": role,
        "message": f"Authenticated successfully as {role}"
    }

