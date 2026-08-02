import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class MotionStatus:
    motion_level: str  # LOW, MEDIUM, HIGH
    confidence_pct: float
    vector_magnitude_g: float
    is_artefact_present: bool

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class MotionArtifactDetector:
    """
    Detects physical movement (Walking, Running, Jumping, Loose Watch, Hand Shaking)
    using 3-axis Accelerometer or raw signal amplitude variance.
    """

    @staticmethod
    def detect_motion(
        signal_window: np.ndarray,
        acc_x: np.ndarray = None,
        acc_y: np.ndarray = None,
        acc_z: np.ndarray = None
    ) -> MotionStatus:
        if acc_x is not None and len(acc_x) > 0:
            vm = np.sqrt(acc_x**2 + acc_y**2 + acc_z**2)
            max_g = float(np.max(vm))
            var_g = float(np.var(vm))
        else:
            # Fallback estimation from signal variance directly
            var_g = float(np.var(signal_window))
            max_g = float(np.max(np.abs(signal_window)))

        if max_g > 3.0 or var_g > 2.0:
            level = "HIGH"
            conf = 96.5
            is_art = True
        elif max_g > 1.8 or var_g > 0.8:
            level = "MEDIUM"
            conf = 88.0
            is_art = True
        else:
            level = "LOW"
            conf = 98.0
            is_art = False

        return MotionStatus(
            motion_level=level,
            confidence_pct=conf,
            vector_magnitude_g=round(max_g, 3),
            is_artefact_present=is_art
        )
