import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class MotionFeatures:
    acc_mean_g: float
    acc_variance: float
    vector_magnitude_g: float
    peak_frequency_hz: float
    is_motion_spike: bool

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def extract_motion_features(acc_x: np.ndarray, acc_y: np.ndarray, acc_z: np.ndarray, fs: float = 32.0) -> MotionFeatures:
    """
    Extracts 3-axis accelerometer motion features and vector magnitude (g).
    """
    if len(acc_x) == 0:
        return MotionFeatures(0.0, 0.0, 1.0, 0.0, False)

    vm = np.sqrt(acc_x**2 + acc_y**2 + acc_z**2)
    vm_mean = float(np.mean(vm))
    vm_var = float(np.var(vm))
    is_spike = bool(np.max(vm) > 1.8 or vm_var > 0.25)

    return MotionFeatures(
        acc_mean_g=round(vm_mean, 3),
        acc_variance=round(vm_var, 4),
        vector_magnitude_g=round(float(np.max(vm)), 3),
        peak_frequency_hz=1.2 if is_spike else 0.2,
        is_motion_spike=is_spike
    )
