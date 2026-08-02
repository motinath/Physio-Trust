import pytest
from physiotrust.ai.personalization.baseline_service import BaselineService
from physiotrust.ai.personalization.circadian_model import CircadianEngine
from physiotrust.ai.memory.profile_manager import ProfileManager
from physiotrust.ai.trend.analytics import TrendAnalyticsService


def test_baseline_service():
    base = BaselineService.compute_user_baseline(subject_id="100", resting_hr=62.0)
    assert base.resting_hr_bpm == 62.0
    assert base.active_hr_bpm == 107.0
    assert base.spo2_baseline_pct == 98.5


def test_circadian_engine():
    circ = CircadianEngine.get_circadian_profile(resting_hr=64.0)
    assert circ.morning_hr_bpm == 62.0
    assert circ.afternoon_hr_bpm == 76.0
    assert circ.night_hr_bpm == 56.0
    assert circ.typical_sleep_time == "10:45 PM"


def test_profile_manager():
    prof = ProfileManager.get_profile(subject_id="100")
    assert prof.subject_id == "100"
    assert prof.age == 30
    assert prof.recovery_capacity_pct == 92.0


def test_trend_analytics():
    trends = TrendAnalyticsService.get_longitudinal_trends(subject_id="100")
    assert "IMPROVING" in trends.trend_30d_hr
    assert "OPTIMAL" in trends.trend_30d_recovery
