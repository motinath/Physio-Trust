import numpy as np
import pytest
from physiotrust.ai.quality.quality_score import SignalQualityEngine
from physiotrust.ai.quality.snr import estimate_snr_db
from physiotrust.ai.quality.noise_detector import detect_powerline_interference
from physiotrust.ai.quality.drift_detector import detect_baseline_drift


def test_signal_quality_engine():
    fs = 360.0
    t = np.linspace(0, 5.0, int(fs * 5.0))
    clean_ecg = np.sin(2 * np.pi * 1.2 * t)
    
    sqi_clean = SignalQualityEngine.compute_sqi(clean_ecg, fs=fs)
    assert sqi_clean.overall_quality_score > 60.0
    assert sqi_clean.snr_db > 0.0

    # Test flatline
    flatline = np.zeros_like(t) + 0.001
    sqi_flat = SignalQualityEngine.compute_sqi(flatline, fs=fs)
    assert sqi_flat.overall_quality_score < sqi_clean.overall_quality_score


def test_snr_estimator():
    clean = np.sin(np.linspace(0, 10, 1800))
    snr_db = estimate_snr_db(clean)
    assert isinstance(snr_db, float)
    assert snr_db > -20.0


def test_noise_and_drift_detectors():
    t = np.linspace(0, 5.0, 1800)
    sig = np.sin(2 * np.pi * 1.2 * t) + 2.0 * t  # Baseline linear drift
    drift = detect_baseline_drift(sig)
    assert drift > 0.5
