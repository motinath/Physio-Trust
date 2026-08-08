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


def calculate_sensor_agreement(
    ecg_bpm: float,
    ppg_bpm: float,
    is_motion_high: bool = False,
    ecg_sqi: float = 1.0,
    ppg_sqi: float = 1.0
) -> SensorAgreement:
    """
    Compares ECG Heart Rate vs PPG Pulse Rate agreement dynamically based on actual signal quality and HR delta.
    """
    delta = float(abs(ecg_bpm - ppg_bpm))
    
    # Continuous mathematical decay based on heart rate delta (BPM)
    delta_factor = float(np.exp(-0.035 * delta))
    
    # SQI combination factor
    sqi_factor = max(0.2, min(1.0, (float(ecg_sqi) + float(ppg_sqi)) / 2.0 if ecg_sqi <= 1.0 and ppg_sqi <= 1.0 else (float(ecg_sqi) + float(ppg_sqi)) / 200.0))
    
    # Motion penalty
    motion_factor = 0.65 if is_motion_high else 1.0
    
    score = float(np.clip(delta_factor * sqi_factor * motion_factor, 0.15, 0.99))
    is_agree = delta < 8.0 and not is_motion_high and score >= 0.70
    
    if is_agree:
        primary = "ECG + PPG Dual Fusion"
    elif is_motion_high:
        primary = "ECG Lead (PPG Motion Attenuated)"
    elif delta > 12.0:
        primary = "ECG Lead (Sensor Discrepancy)"
    else:
        primary = "ECG Primary Lead"

    return SensorAgreement(
        ecg_ppg_delta_bpm=round(delta, 1),
        is_in_agreement=is_agree,
        agreement_score=round(score, 4),
        primary_reliable_sensor=primary
    )
