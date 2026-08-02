from typing import Dict, Any
from physiotrust.auth.jwt import JWTAuthManager
from physiotrust.auth.roles import RolePermissions


class SecurityPermissionChecker:
    """
    Enforces authorization gatekeeping for internal API routes and SDK calls.
    """

    @staticmethod
    def verify_request_permission(auth_header: str, required_permission: str) -> Dict[str, Any]:
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"allowed": False, "reason": "Missing or invalid authorization header"}
        
        token = auth_header.split(" ")[1]
        decoded = JWTAuthManager.decode_token(token)

        if not decoded.get("valid"):
            return {"allowed": False, "reason": decoded.get("error", "Invalid token")}

        role = decoded.get("role", "Researcher")
        if RolePermissions.has_permission(role, required_permission):
            return {"allowed": True, "subject_id": decoded.get("subject_id"), "role": role}
        
        return {"allowed": False, "reason": f"Role '{role}' lacks required permission '{required_permission}'"}
