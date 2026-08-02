"""Signal processing subpackage for filtering, preprocessing, segmentation, and quality feature extraction."""
from .filter import bandpass_filter, normalize_signal, preprocess_signal
from .filters import butterworth_bandpass, remove_baseline_wander, smooth_signal
from .preprocessing import preprocess_ecg_pipeline, preprocess_ppg_pipeline, zscore_normalize
from .windowing import window_signal
from .segmentation import segment_signal
from .features import extract_quality_features, SignalFeatures

__all__ = [
    "bandpass_filter",
    "normalize_signal",
    "preprocess_signal",
    "butterworth_bandpass",
    "remove_baseline_wander",
    "smooth_signal",
    "preprocess_ecg_pipeline",
    "preprocess_ppg_pipeline",
    "zscore_normalize",
    "window_signal",
    "segment_signal",
    "extract_quality_features",
    "SignalFeatures",
]
