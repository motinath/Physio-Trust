import numpy as np


def window_signal(
    data: np.ndarray,
    window_size_sec: float = 5.0,
    overlap_sec: float = 0.0,
    fs: float = 360.0
) -> np.ndarray:
    """
    Segments continuous signal into fixed time windows with optional overlap.

    Args:
        data: 1D numpy array of signal values
        window_size_sec: Window length in seconds (default: 5.0s)
        overlap_sec: Overlap length in seconds (default: 0.0s)
        fs: Sampling frequency in Hz (default: 360Hz)

    Returns:
        2D numpy array of shape (num_windows, window_samples)
    """
    window_samples = int(window_size_sec * fs)
    overlap_samples = int(overlap_sec * fs)
    step = window_samples - overlap_samples

    if step <= 0:
        raise ValueError("Overlap must be smaller than window size.")

    if len(data) < window_samples:
        # Return padded window if signal shorter than single window
        padded = np.pad(data, (0, window_samples - len(data)), mode='constant')
        return np.array([padded])

    n_windows = (len(data) - window_samples) // step + 1

    windows = []
    for i in range(n_windows):
        start = i * step
        end = start + window_samples
        windows.append(data[start:end])

    return np.array(windows)
