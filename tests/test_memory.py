import pytest
from physiotrust.memory.timeline import PhysiologicalTimeline
from physiotrust.memory.history import PhysiologicalHistoryService


def test_timeline_and_history():
    timeline = PhysiologicalTimeline(subject_id="100")
    timeline.add_snapshot(hr_bpm=64.0, hrv_rmssd=48.0, trust_score=0.98, context="rest")
    timeline.add_snapshot(hr_bpm=66.0, hrv_rmssd=46.0, trust_score=0.96, context="rest")

    snaps = timeline.get_recent_history(limit=10)
    assert len(snaps) == 2

    avgs = PhysiologicalHistoryService.compute_daily_averages(snaps)
    assert avgs['avg_heart_rate_bpm'] == 65.0
    assert avgs['sample_count'] == 2
