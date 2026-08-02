import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any
from .snr import estimate_snr_db
from .noise_detector import detect_powerline_interference
from .drift_detector import detect_baseline_drift
from physiotrust.signal_processing.features import extract_quality_features


@dataclass
class QualityBreakdown:
    overall_quality_score: float  # 0 to 100
    snr_db: float
    powerline_interference_score: float
    baseline_drift_score: float
    entropy_score: float
    kurtosis_score: float
    amplitude_stability_score: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class SignalQualityEngine:
    """
    PhysioTrust Signature Feature: Signal Quality Engine.
    Computes a 0–100 Signal Quality Index (SQI) incorporating SNR, noise, baseline drift, and waveform morphology.
    """

    @staticmethod
    def compute_sqi(signal_window: np.ndarray, fs: float = 360.0) -> QualityBreakdown:
        if len(signal_window) == 0:
            return QualityBreakdown(0.0, -60.0, 1.0, 1.0, 0.0, 0.0, 0.0)

        snr_db = estimate_snr_db(signal_window)
        snr_norm = float(np.clip((snr_db + 10.0) / 40.0, 0.0, 1.0))

        powerline = detect_powerline_interference(signal_window, fs=fs)
        drift = detect_baseline_drift(signal_window)

        features = extract_quality_features(signal_window)

        entropy_score = float(1.0 / (1.0 + features.entropy * 0.2))
        kurtosis_score = float(np.clip((features.kurtosis + 2.0) / 10.0, 0.1, 1.0))
        amp_stability = float(1.0 / (1.0 + np.exp(-10.0 * (features.variance - 0.1))))

        # Weighted combination scaled to 0-100
        sqi = 100.0 * (
            0.40 * snr_norm +
            0.20 * entropy_score +
            0.20 * kurtosis_score +
            0.10 * (1.0 - powerline) +
            0.10 * (1.0 - drift)
        )

        sqi_clamped = float(np.clip(sqi, 0.0, 100.0))

        return QualityBreakdown(
            overall_quality_score=round(sqi_clamped, 1),
            snr_db=round(snr_db, 2),
            powerline_interference_score=round(powerline, 3),
            baseline_drift_score=round(drift, 3),
            entropy_score=round(entropy_score, 3),
            kurtosis_score=round(kurtosis_score, 3),
            amplitude_stability_score=round(amp_stability, 3)
        )
