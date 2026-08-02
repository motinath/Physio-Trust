from dataclasses import dataclass, asdict
from typing import Dict, Any
from .agreement import calculate_sensor_agreement, SensorAgreement


@dataclass
class FusionOutput:
    fused_heart_rate_bpm: float
    confidence_pct: float
    ecg_weight: float
    ppg_weight: float
    sensor_agreement: SensorAgreement

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d['sensor_agreement'] = self.sensor_agreement.to_dict()
        return d


class MultiSensorFusionEngine:
    """
    PhysioTrust Multi-Sensor Fusion Engine.
    Dynamically weights multi-sensor channels (ECG vs PPG vs IMU) based on SQI and motion.
    """

    @staticmethod
    def fuse_channels(
        ecg_bpm: float,
        ppg_bpm: float,
        ecg_sqi: float,
        ppg_sqi: float,
        is_motion_high: bool = False
    ) -> FusionOutput:
        # Dynamic weighting based on SQI & Motion
        if is_motion_high:
            ecg_w = 0.85
            ppg_w = 0.15
        else:
            ecg_w = ecg_sqi / (ecg_sqi + ppg_sqi + 1e-5)
            ppg_w = 1.0 - ecg_w

        fused_hr = (ecg_w * ecg_bpm) + (ppg_w * ppg_bpm)
        agreement = calculate_sensor_agreement(ecg_bpm, ppg_bpm, is_motion_high=is_motion_high)

        conf = agreement.agreement_score * 100.0

        return FusionOutput(
            fused_heart_rate_bpm=round(fused_hr, 1),
            confidence_pct=round(conf, 1),
            ecg_weight=round(ecg_w, 2),
            ppg_weight=round(ppg_w, 2),
            sensor_agreement=agreement
        )
