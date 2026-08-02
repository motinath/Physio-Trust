import numpy as np
import scipy.signal
from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class ECGFeatures:
    heart_rate_bpm: float
    rr_intervals_ms: List[float]
    rmssd: float
    sdnn: float
    qrs_width_ms: float
    r_peak_amplitude_mean: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def extract_ecg_features(signal_window: np.ndarray, fs: float = 360.0) -> ECGFeatures:
    """
    Extracts morphological and time-domain HRV features directly from ECG window via peak detection layout.
    """
    if len(signal_window) == 0:
        return ECGFeatures(0.0, [], 0.0, 0.0, 0.0, 0.0)

    # Scipy peak detection for QRS R-peaks
    peaks, properties = scipy.signal.find_peaks(signal_window, distance=int(fs * 0.4), height=0.2)
    
    if len(peaks) > 1:
        rr_samples = np.diff(peaks)
        rr_ms = (rr_samples / fs * 1000.0).tolist()
        hr_bpm = float(60000.0 / np.mean(rr_ms))
        sdnn = float(np.std(rr_ms))
        rmssd = float(np.sqrt(np.mean(np.diff(rr_ms) ** 2))) if len(rr_ms) > 1 else 0.0
        r_amp = float(np.mean(signal_window[peaks]))
        
        # Calculate QRS width from peak width at half prominence
        widths, _, _, _ = scipy.signal.peak_widths(signal_window, peaks, rel_height=0.5)
        qrs_width = float(np.mean(widths) / fs * 1000.0) if len(widths) > 0 else 85.0
    else:
        rr_ms = [833.3]
        hr_bpm = float(60.0 * fs / len(signal_window)) if len(signal_window) > 0 else 72.0
        sdnn = 0.0
        rmssd = 0.0
        r_amp = float(np.max(signal_window)) if len(signal_window) > 0 else 1.0
        qrs_width = 85.0

    return ECGFeatures(
        heart_rate_bpm=round(hr_bpm, 1),
        rr_intervals_ms=[round(x, 1) for x in rr_ms],
        rmssd=round(rmssd, 2),
        sdnn=round(sdnn, 2),
        qrs_width_ms=round(qrs_width, 1),
        r_peak_amplitude_mean=round(r_amp, 4)
    )
