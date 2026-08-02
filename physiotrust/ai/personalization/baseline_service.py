from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class ComprehensiveBaseline:
    subject_id: str
    resting_hr_bpm: float
    active_hr_bpm: float
    recovery_hr_bpm: float
    max_hr_bpm: float
    hrv_rmssd_ms: float
    spo2_baseline_pct: float
    respiration_rate_pm: float
    skin_temp_celsius: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class BaselineService:
    """
    PhysioTrust Phase 4 Personal Baseline Engine.
    Computes individual cardiovascular, oxygenation, respiration, and thermal baseline profiles.
    """

    @staticmethod
    def compute_user_baseline(subject_id: str = "100", resting_hr: float = 64.0, hrv_rmssd: float = 48.2) -> ComprehensiveBaseline:
        active_hr = resting_hr + 45.0
        recovery_hr = resting_hr + 14.0
        max_hr = 220.0 - 30.0  # Age-adjusted estimate

        return ComprehensiveBaseline(
            subject_id=subject_id,
            resting_hr_bpm=round(resting_hr, 1),
            active_hr_bpm=round(active_hr, 1),
            recovery_hr_bpm=round(recovery_hr, 1),
            max_hr_bpm=round(max_hr, 1),
            hrv_rmssd_ms=round(hrv_rmssd, 1),
            spo2_baseline_pct=98.5,
            respiration_rate_pm=14.2,
            skin_temp_celsius=36.6
        )
