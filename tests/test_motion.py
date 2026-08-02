import numpy as np
import pytest
from physiotrust.ai.context.motion_detector import MotionArtifactDetector


def test_motion_artifact_detector():
    clean_win = np.sin(np.linspace(0, 10, 1800))
    status_low = MotionArtifactDetector.detect_motion(clean_win)
    assert status_low.motion_level == "LOW"
    assert status_low.is_artefact_present is False

    # Simulate high motion accelerometry
    acc_x = np.random.normal(0, 1.5, 100)
    acc_y = np.random.normal(0, 1.5, 100)
    acc_z = np.random.normal(0, 1.5, 100)

    status_high = MotionArtifactDetector.detect_motion(clean_win, acc_x, acc_y, acc_z)
    assert status_high.motion_level == "HIGH"
    assert status_high.is_artefact_present is True
