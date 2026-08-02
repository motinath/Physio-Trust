import time
import hashlib
from typing import Dict, Any


class JWTAuthManager:
    """
    PhysioTrust Phase 8 JWT Authentication Manager.
    Generates and verifies JWT access tokens for internal platform users.
    """

    SECRET_KEY = "physiotrust_internal_secret_key_v8"
    ALGORITHM = "HS256"

    @classmethod
    def create_access_token(cls, subject_id: str, role: str = "Researcher") -> str:
        ts = int(time.time())
        payload = f"{subject_id}|{role}|{ts}"
        signature = hashlib.sha256(f"{payload}|{cls.SECRET_KEY}".encode()).hexdigest()
        return f"{payload}.{signature}"

    @classmethod
    def decode_token(cls, token: str) -> Dict[str, Any]:
        try:
            payload, signature = token.split(".")
            expected_sig = hashlib.sha256(f"{payload}|{cls.SECRET_KEY}".encode()).hexdigest()
            if signature != expected_sig:
                return {"valid": False, "error": "Invalid signature"}
            parts = payload.split("|")
            return {
                "valid": True,
                "subject_id": parts[0],
                "role": parts[1],
                "timestamp": float(parts[2])
            }
        except Exception as e:
            return {"valid": False, "error": f"Malformed token: {str(e)}"}
