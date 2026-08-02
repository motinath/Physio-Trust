import numpy as np
from .filters import butterworth_bandpass, remove_baseline_wander, smooth_signal


def zscore_normalize(data: np.ndarray) -> np.ndarray:
    std = np.std(data)
    if std == 0 or np.isnan(std):
        return np.zeros_like(data)
    return (data - np.mean(data)) / std


def interpolate_missing_values(data: np.ndarray) -> np.ndarray:
    """
    Linear interpolation for missing or NaN samples.
    """
    nans = np.isnan(data)
    if not np.any(nans):
        return data
    data_clean = data.copy()
    data_clean[nans] = np.interp(np.flatnonzero(nans), np.flatnonzero(~nans), data[~nans])
    return data_clean


def preprocess_ecg_pipeline(data: np.ndarray, fs: float = 360.0) -> np.ndarray:
    """
    ECG Preprocessing Pipeline: Missing Interpolation -> Baseline Correction -> Bandpass Filter -> Normalization.
    """
    clean_data = interpolate_missing_values(data)
    no_drift = remove_baseline_wander(clean_data, fs=fs, cutoff=0.5)
    filtered = butterworth_bandpass(no_drift, lowcut=0.5, highcut=50.0, fs=fs)
    normalized = zscore_normalize(filtered)
    return normalized


def preprocess_ppg_pipeline(data: np.ndarray, fs: float = 64.0) -> np.ndarray:
    """
    PPG Preprocessing Pipeline: Interpolation -> Smoothing -> Bandpass Filter (0.5-8.0Hz) -> Normalization.
    """
    clean_data = interpolate_missing_values(data)
    smoothed = smooth_signal(clean_data, window_len=3)
    filtered = butterworth_bandpass(smoothed, lowcut=0.5, highcut=8.0, fs=fs, order=2)
    normalized = zscore_normalize(filtered)
    return normalized
