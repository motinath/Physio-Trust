from dataclasses import dataclass
from typing import Dict, Any, List
from physiotrust.ai.prediction.prediction_engine import PredictionEngine
from physiotrust.health_state.health_state import HealthStateEstimator
from physiotrust.quality_engine.quality_score import SignalQualityEngine


class PhysioTrustClient:
    """
    PhysioTrust Internal Python Developer SDK.
    Enables programmatic access to physiological signal processing, trust scoring, health state estimation, and forecasting.

    Usage:
        from physiotrust import Client
        client = Client(subject_id="100")
        predictions = client.predict()
    """

    def __init__(self, subject_id: str = "100", api_key: str = "internal_dev_key"):
        self.subject_id = subject_id
        self.api_key = api_key

    def predict(self, current_hr: float = 64.0) -> List[Dict[str, Any]]:
        """Forecasts multi-horizon physiological states."""
        forecasts = PredictionEngine.forecast_all(subject_id=self.subject_id, current_hr=current_hr)
        return [f.to_dict() for f in forecasts]

    def get_health_state(self, hr_bpm: float = 64.0, hrv_rmssd: float = 48.2) -> Dict[str, Any]:
        """Estimates recovery, stress, fatigue, and readiness metrics."""
        state = HealthStateEstimator.estimate_state(hr_bpm=hr_bpm, hrv_rmssd=hrv_rmssd, baseline_hr=64.0, baseline_hrv=48.2)
        return state.to_dict()

    def evaluate_signal_quality(self, signal_window: list, fs: float = 360.0) -> Dict[str, Any]:
        """Computes comprehensive Signal Quality Index (SQI)."""
        sqi = SignalQualityEngine.compute_sqi(signal_window, fs=fs)
        return sqi.to_dict()
