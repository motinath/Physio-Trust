import pytest
from physiotrust.health_state.health_state import HealthStateEstimator
from physiotrust.recommendation.recommendation import RecommendationEngine


def test_health_state_estimator():
    state = HealthStateEstimator.estimate_state(hr_bpm=64.0, hrv_rmssd=48.2, baseline_hr=64.0, baseline_hrv=48.0)
    assert state.recovery_score_pct >= 80.0
    assert state.readiness_score_pct >= 80.0
    assert state.sleep_quality == "Good"


def test_recommendation_engine():
    recs = RecommendationEngine.generate_recommendations(hr_bpm=85.0, baseline_hr=64.0, readiness_pct=85.0, trust_score=0.97)
    assert len(recs) >= 1
    assert recs[0].category == "REST"
    assert recs[0].priority == "HIGH"
