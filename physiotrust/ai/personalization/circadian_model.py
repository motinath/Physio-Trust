from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class CircadianDiurnalProfile:
    morning_hr_bpm: float
    afternoon_hr_bpm: float
    evening_hr_bpm: float
    night_hr_bpm: float
    recovery_window_mins: int
    peak_activity_time: str
    typical_sleep_time: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class CircadianEngine:
    """
    Models 24-hour diurnal physiological curves for individual users.
    """

    @staticmethod
    def get_circadian_profile(resting_hr: float = 64.0) -> CircadianDiurnalProfile:
        return CircadianDiurnalProfile(
            morning_hr_bpm=round(resting_hr - 2.0, 1),
            afternoon_hr_bpm=round(resting_hr + 12.0, 1),
            evening_hr_bpm=round(resting_hr + 4.0, 1),
            night_hr_bpm=round(resting_hr - 8.0, 1),
            recovery_window_mins=45,
            peak_activity_time="04:30 PM",
            typical_sleep_time="10:45 PM"
        )
