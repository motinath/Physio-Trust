from enum import Enum


class UserRole(str, Enum):
    RESEARCHER = "Researcher"
    DEVELOPER = "Developer"
    ADMINISTRATOR = "Administrator"
    SUPERVISOR = "Supervisor"


class RolePermissions:
    """
    Defines Role-Based Access Control (RBAC) permissions across internal platform user roles.
    """

    ROLE_PERMISSIONS_MAP = {
        UserRole.RESEARCHER: ["view_signals", "view_trust", "view_xai", "view_predictions", "access_workspace"],
        UserRole.DEVELOPER: ["view_signals", "view_trust", "view_xai", "view_predictions", "access_workspace", "modify_code", "access_logs"],
        UserRole.SUPERVISOR: ["view_signals", "view_trust", "view_xai", "view_predictions", "access_workspace", "approve_reports"],
        UserRole.ADMINISTRATOR: ["view_signals", "view_trust", "view_xai", "view_predictions", "access_workspace", "modify_code", "access_logs", "manage_users"]
    }

    @classmethod
    def has_permission(cls, role: str, permission: str) -> bool:
        try:
            enum_role = UserRole(role)
            return permission in cls.ROLE_PERMISSIONS_MAP.get(enum_role, [])
        except ValueError:
            return False
