import numpy as np


def detect_powerline_interference(signal_window: np.ndarray, fs: float = 360.0) -> float:
    """
    Detects 50Hz/60Hz powerline interference energy ratio.
    """
    if len(signal_window) == 0:
        return 0.0

    fft_vals = np.abs(np.fft.rfft(signal_window))
    freqs = np.fft.rfftfreq(len(signal_window), 1.0 / fs)

    # Energy in 49-51 Hz or 59-61 Hz
    powerline_mask = ((freqs >= 49) & (freqs <= 51)) | ((freqs >= 59) & (freqs <= 61))
    total_energy = np.sum(fft_vals**2) + 1e-10
    powerline_energy = np.sum(fft_vals[powerline_mask]**2)

    ratio = float(powerline_energy / total_energy)
    return float(np.clip(ratio * 10.0, 0.0, 1.0))
