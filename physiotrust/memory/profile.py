from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class PhysiologicalProfile:
    subject_id: str
    resting_hr_bpm: float
    resting_hrv_rmssd: float
    normal_hr_range_min: float
    normal_hr_range_max: float
    recovery_rate_bpm_per_min: float
    total_monitored_days: int

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def get_default_user_profile(subject_id: str = "100") -> PhysiologicalProfile:
    return PhysiologicalProfile(
        subject_id=subject_id,
        resting_hr_bpm=64.0,
        resting_hrv_rmssd=48.2,
        normal_hr_range_min=56.0,
        normal_hr_range_max=74.0,
        recovery_rate_bpm_per_min=18.5,
        total_monitored_days=14
    )
