import numpy as np
import pytest
from physiotrust.ai.signal_processing.filter import bandpass_filter, normalize_signal, preprocess_signal
from physiotrust.ai.signal_processing.windowing import window_signal
from physiotrust.ai.signal_processing.features import extract_quality_features


def test_bandpass_filter():
    fs = 360.0
    t = np.linspace(0, 1.0, int(fs))
    # 10Hz signal (within 0.5-50Hz passband) + 120Hz high frequency noise
    sig = np.sin(2 * np.pi * 10 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)
    filtered = bandpass_filter(sig, lowcut=0.5, highcut=50.0, fs=fs)
    assert len(filtered) == len(sig)
    # Filtered signal std should be lower due to noise removal
    assert np.std(filtered) < np.std(sig)


def test_normalize_signal():
    data = np.array([10.0, 20.0, 30.0, 40.0, 50.0])
    norm = normalize_signal(data)
    assert pytest.approx(np.mean(norm), abs=1e-5) == 0.0
    assert pytest.approx(np.std(norm), abs=1e-5) == 1.0


def test_window_signal():
    data = np.random.randn(1800)  # 5 seconds at 360Hz
    windows = window_signal(data, window_size_sec=5.0, overlap_sec=0.0, fs=360.0)
    assert windows.shape == (1, 1800)

    # 10 seconds at 360Hz -> 2 windows
    data_10s = np.random.randn(3600)
    windows_2 = window_signal(data_10s, window_size_sec=5.0, overlap_sec=0.0, fs=360.0)
    assert windows_2.shape == (2, 1800)


def test_extract_quality_features():
    clean_win = np.sin(np.linspace(0, 4 * np.pi, 1800))
    features = extract_quality_features(clean_win)
    assert features.variance > 0
    assert isinstance(features.entropy, float)
    assert isinstance(features.kurtosis, float)
