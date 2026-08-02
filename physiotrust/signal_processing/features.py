import numpy as np
import scipy.stats
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class SignalFeatures:
    variance: float
    entropy: float
    snr_proxy: float
    zero_crossings: int
    kurtosis: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def extract_quality_features(signal_window: np.ndarray) -> SignalFeatures:
    """
    Extracts core quality features from a single signal window:
      - Variance: Detects flatlines or excessive amplitude variance.
      - Shannon Entropy: Measures signal complexity (low for clean structured ECG, high for noise).
      - SNR Proxy (dB): Power ratio of signal relative to baseline.
      - Zero Crossing Rate (ZCR): High-frequency noise indicator.
      - Kurtosis: Evaluates peakiness of QRS complexes (clean ECG has high Kurtosis).
    """
    if len(signal_window) == 0:
        return SignalFeatures(variance=0.0, entropy=0.0, snr_proxy=0.0, zero_crossings=0, kurtosis=0.0)

    # 1. Variance
    var = float(np.var(signal_window))

    # 2. Entropy
    hist, _ = np.histogram(signal_window, bins=20, density=True)
    hist = hist[hist > 0]
    entropy = float(-np.sum(hist * np.log2(hist))) if len(hist) > 0 else 0.0

    # 3. SNR Proxy (Power in dB)
    sig_power = float(np.mean(signal_window ** 2))
    snr = 10.0 * np.log10(sig_power) if sig_power > 1e-12 else -60.0

    # 4. Zero Crossings
    zcr = int(len(np.where(np.diff(np.sign(signal_window)))[0]))

    # 5. Kurtosis
    kurt = float(scipy.stats.kurtosis(signal_window))
    if np.isnan(kurt):
        kurt = 0.0

    return SignalFeatures(
        variance=var,
        entropy=entropy,
        snr_proxy=snr,
        zero_crossings=zcr,
        kurtosis=kurt
    )
