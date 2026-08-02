import numpy as np
import scipy.signal


def bandpass_filter(
    data: np.ndarray,
    lowcut: float = 0.5,
    highcut: float = 50.0,
    fs: float = 360.0,
    order: int = 4
) -> np.ndarray:
    """
    Applies a Butterworth bandpass filter to eliminate baseline wander and high-frequency noise.

    Args:
        data: 1D numpy array of signal values
        lowcut: Cutoff frequency for low pass (Hz)
        highcut: Cutoff frequency for high pass (Hz)
        fs: Sampling rate (Hz)
        order: Order of the Butterworth filter

    Returns:
        Filtered 1D numpy array
    """
    nyquist = 0.5 * fs
    low = lowcut / nyquist
    high = highcut / nyquist
    b, a = scipy.signal.butter(order, [low, high], btype='band')
    filtered = scipy.signal.filtfilt(b, a, data)
    return filtered


def normalize_signal(data: np.ndarray) -> np.ndarray:
    """
    Standardizes signal using Z-score normalization (mean = 0, std = 1).

    Args:
        data: 1D numpy array

    Returns:
        Z-score normalized 1D numpy array
    """
    mean = np.mean(data)
    std = np.std(data)
    if std == 0 or np.isnan(std):
        return np.zeros_like(data)
    return (data - mean) / std


def preprocess_signal(data: np.ndarray, fs: float = 360.0, lowcut: float = 0.5, highcut: float = 50.0) -> np.ndarray:
    """
    Full preprocessing pipeline: Butterworth Bandpass Filter -> Z-Score Normalization.
    """
    filtered = bandpass_filter(data, lowcut=lowcut, highcut=highcut, fs=fs)
    normalized = normalize_signal(filtered)
    return normalized
