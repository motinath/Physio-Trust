import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class CircadianPattern:
    morning_resting_hr_bpm: float
    afternoon_peak_hr_bpm: float
    nocturnal_dip_hr_bpm: float
    circadian_amplitude: float
    is_normal_dip: bool

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class CircadianRhythmModel:
    """
    Models individual 24-hour diurnal physiological rhythms.
    """

    @staticmethod
    def estimate_diurnal_pattern(baseline_resting_hr: float = 64.0) -> CircadianPattern:
        morning_hr = baseline_resting_hr - 2.0
        afternoon_peak = baseline_resting_hr + 12.0
        nocturnal_dip = baseline_resting_hr - 8.0
        amplitude = afternoon_peak - nocturnal_dip
        is_normal = nocturnal_dip < morning_hr

        return CircadianPattern(
            morning_resting_hr_bpm=round(morning_hr, 1),
            afternoon_peak_hr_bpm=round(afternoon_peak, 1),
            nocturnal_dip_hr_bpm=round(nocturnal_dip, 1),
            circadian_amplitude=round(amplitude, 1),
            is_normal_dip=is_normal
        )
