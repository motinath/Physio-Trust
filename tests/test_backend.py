from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "available_records" in data


def test_process_endpoint_mitbih():
    payload = {
        "subject_id": "100",
        "context": "rest",
        "window_sec": 5.0
    }
    response = client.post("/api/v1/process", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "MITBIH_100" in data["subject_id"]
    assert data["total_windows"] == 361
    assert data["acceptance_rate"] == 100.0
    assert len(data["windows"]) == 361


def test_baseline_endpoint():
    response = client.get("/api/v1/baseline/100")
    assert response.status_code == 200
    data = response.json()
    assert data["subject_id"] == "100"
