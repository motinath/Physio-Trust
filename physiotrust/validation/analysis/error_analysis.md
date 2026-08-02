# PhysioTrust Error Analysis & Mitigation Log

| Error ID | Module | Root Cause | System Impact | Mitigation / Regression Test |
| :--- | :--- | :--- | :--- | :--- |
| **ERR-001** | QRS Peak Detection | Muscle tremor high-frequency noise spikes | Temporary overestimation of instantaneous HR | Applied bandpass filter (0.5-50Hz) + peak width validation (`tests/test_signal_processing.py`). |
| **ERR-002** | PPG Fusion | Wrist motion artifact during running | Discrepancy between ECG and PPG pulse rates | Added 3-axis accelerometer vector magnitude thresholding (`tests/test_motion.py`). |
| **ERR-003** | Personal Baseline | Rapid initial baseline shift on new subjects | Transient baseline variance fluctuation | Implemented Bayesian prior smoothing & 3-day minimum sample constraint (`tests/test_personalization.py`). |
