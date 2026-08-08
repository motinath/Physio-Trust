from dataclasses import dataclass, asdict
from typing import List, Dict, Any
import datetime


@dataclass
class TimelineSnapshot:
    timestamp: str
    heart_rate_bpm: float
    hrv_rmssd: float
    trust_score: float
    context: str
    activity: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class PhysiologicalTimeline:
    """
    Stores and manages time-series historical snapshots for a user profile.
    """

    def __init__(self, subject_id: str):
        self.subject_id = subject_id
        self.snapshots: List[TimelineSnapshot] = []

    def add_snapshot(self, hr_bpm: float, hrv_rmssd: float, trust_score: float, context: str = "rest", activity: str = "resting"):
        now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
        snap = TimelineSnapshot(
            timestamp=now_str,
            heart_rate_bpm=round(hr_bpm, 1),
            hrv_rmssd=round(hrv_rmssd, 2),
            trust_score=round(trust_score, 4),
            context=context,
            activity=activity
        )
        self.snapshots.append(snap)
        if len(self.snapshots) > 1000:
            self.snapshots.pop(0)

    def get_recent_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        return [s.to_dict() for s in self.snapshots[-limit:]]
