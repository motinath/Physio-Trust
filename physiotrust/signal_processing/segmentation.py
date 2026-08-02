import numpy as np


def segment_signal(
    data: np.ndarray,
    window_size_sec: float = 5.0,
    overlap_sec: float = 0.0,
    fs: float = 360.0
) -> np.ndarray:
    """
    Segments continuous signal arrays into fixed time windows.
    """
    window_samples = int(window_size_sec * fs)
    overlap_samples = int(overlap_sec * fs)
    step = window_samples - overlap_samples

    if step <= 0:
        raise ValueError("Overlap must be smaller than window size.")

    if len(data) < window_samples:
        padded = np.pad(data, (0, window_samples - len(data)), mode='constant')
        return np.array([padded])

    n_windows = (len(data) - window_samples) // step + 1
    windows = [data[i * step : i * step + window_samples] for i in range(n_windows)]
    return np.array(windows)
