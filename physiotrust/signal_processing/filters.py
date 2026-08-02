import numpy as np
import scipy.signal


def butterworth_bandpass(
    data: np.ndarray,
    lowcut: float = 0.5,
    highcut: float = 50.0,
    fs: float = 360.0,
    order: int = 4
) -> np.ndarray:
    """
    Butterworth Bandpass Filter (0.5 - 50 Hz).
    """
    nyquist = 0.5 * fs
    low = lowcut / nyquist
    high = highcut / nyquist
    b, a = scipy.signal.butter(order, [low, high], btype='band')
    return scipy.signal.filtfilt(b, a, data)


def remove_baseline_wander(data: np.ndarray, fs: float = 360.0, cutoff: float = 0.5) -> np.ndarray:
    """
    High-pass filter to eliminate low-frequency baseline drift.
    """
    nyquist = 0.5 * fs
    normal_cutoff = cutoff / nyquist
    b, a = scipy.signal.butter(2, normal_cutoff, btype='high', analog=False)
    return scipy.signal.filtfilt(b, a, data)


def smooth_signal(data: np.ndarray, window_len: int = 5) -> np.ndarray:
    """
    Moving-average smoothing filter for PPG & respiration signals.
    """
    if window_len < 2 or len(data) < window_len:
        return data
    box = np.ones(window_len) / window_len
    return np.convolve(data, box, mode='same')
