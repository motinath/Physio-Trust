import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class SensorAgreement:
    ecg_ppg_delta_bpm: float
    is_in_agreement: bool
    agreement_score: float  # 0.0 to 1.0
    primary_reliable_sensor: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def calculate_sensor_agreement(ecg_bpm: float, ppg_bpm: float, is_motion_high: bool = False) -> SensorAgreement:
    """
    Compares ECG Heart Rate vs PPG Pulse Rate agreement.
    """
    delta = abs(ecg_bpm - ppg_bpm)
    
    if delta < 5.0 and not is_motion_high:
        is_agree = True
        score = 0.98
        primary = "ECG + PPG Dual Fusion"
    elif is_motion_high:
        is_agree = False
        score = 0.45
        primary = "ECG (PPG Motion Attenuated)"
    elif delta > 15.0:
        is_agree = False
        score = 0.30
        primary = "ECG Lead (PPG Discrepancy)"
    else:
        is_agree = True
        score = 0.82
        primary = "ECG Lead"

    return SensorAgreement(
        ecg_ppg_delta_bpm=round(delta, 1),
        is_in_agreement=is_agree,
        agreement_score=round(score, 2),
        primary_reliable_sensor=primary
    )
