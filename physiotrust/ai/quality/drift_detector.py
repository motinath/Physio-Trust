import numpy as np


def detect_baseline_drift(signal_window: np.ndarray) -> float:
    """
    Detects low-frequency baseline wander and sensor displacement.
    Returns drift score (0.0 = stable, 1.0 = severe drift).
    """
    if len(signal_window) == 0:
        return 0.0

    x = np.arange(len(signal_window))
    slope, intercept = np.polyfit(x, signal_window, 1)
    
    total_drift = abs(slope * len(signal_window))
    drift_score = 1.0 / (1.0 + np.exp(-5.0 * (total_drift - 0.5)))
    return float(np.clip(drift_score, 0.0, 1.0))
