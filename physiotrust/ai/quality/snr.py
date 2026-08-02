import numpy as np


def estimate_snr_db(signal_window: np.ndarray) -> float:
    """
    Estimates Signal-to-Noise Ratio (dB) via spectral energy ratio.
    """
    if len(signal_window) == 0:
        return -60.0

    sig_power = float(np.mean(signal_window ** 2))
    if sig_power < 1e-10:
        return -60.0

    # High frequency residual as noise proxy
    diff = np.diff(signal_window)
    noise_power = float(np.mean(diff ** 2)) / 2.0

    if noise_power < 1e-10:
        return 30.0

    snr_ratio = sig_power / noise_power
    snr_db = 10.0 * np.log10(snr_ratio)
    return float(np.clip(snr_db, -20.0, 40.0))
