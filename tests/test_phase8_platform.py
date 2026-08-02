import pytest
from physiotrust.auth.jwt import JWTAuthManager
from physiotrust.auth.roles import RolePermissions, UserRole
from physiotrust.auth.permissions import SecurityPermissionChecker
from physiotrust import Client
from physiotrust.research.workspace import ResearchWorkspace
from physiotrust.demo.demo_environment import DemoEnvironment
from physiotrust.monitoring.health import SystemHealthMonitor


def test_jwt_auth_manager():
    token = JWTAuthManager.create_access_token(subject_id="100", role="Researcher")
    assert token is not None
    decoded = JWTAuthManager.decode_token(token)
    assert decoded["valid"] is True
    assert decoded["subject_id"] == "100"
    assert decoded["role"] == "Researcher"


def test_role_permissions():
    assert RolePermissions.has_permission("Researcher", "view_trust") is True
    assert RolePermissions.has_permission("Researcher", "manage_users") is False
    assert RolePermissions.has_permission("Administrator", "manage_users") is True


def test_security_permission_checker():
    token = JWTAuthManager.create_access_token(subject_id="100", role="Researcher")
    auth_header = f"Bearer {token}"
    result = SecurityPermissionChecker.verify_request_permission(auth_header, "view_trust")
    assert result["allowed"] is True
    assert result["subject_id"] == "100"


def test_internal_sdk_client():
    client = Client(subject_id="100")
    predictions = client.predict(current_hr=64.0)
    assert len(predictions) >= 5

    health_state = client.get_health_state(hr_bpm=64.0, hrv_rmssd=48.2)
    assert "recovery_score_pct" in health_state


def test_research_workspace():
    ws = ResearchWorkspace()
    log = ws.log_experiment("MIT-BIH Database", "v0.8.0", 0.984, 1.2)
    assert log.experiment_id.startswith("EXP-")
    experiments = ws.list_experiments()
    assert len(experiments) >= 1


def test_demo_environment():
    status = DemoEnvironment.get_demo_status()
    assert status.is_offline_demo_active is True
    assert status.presentation_mode is True
    records = DemoEnvironment.get_sample_demo_records()
    assert len(records) >= 5


def test_system_health_monitor():
    metrics = SystemHealthMonitor.get_system_metrics()
    assert metrics.system_health_status == "OPTIMAL_INTERNAL_RELEASE"
    assert metrics.memory_usage_mb > 0
