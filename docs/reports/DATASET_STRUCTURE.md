# PhysioTrust Dataset Directory Organization

This document details the standardized storage directory structure for biological telemetry recordings.

---

## 1. Directory Structure Mappings

All dataset files are organized under three specialized folders in `datasets/`:

- **`datasets/raw/`**: Holds raw recorded signals (e.g. WFDB headers `.hea`, binary signals `.dat`, annotations `.atr`).
- **`datasets/processed/`**: Holds preprocessed numpy feature arrays (`.npy` files) representing Z-score normalized window signals.
- **`datasets/metadata/`**: Holds catalogs, manifests, and record mappings (`dataset_manifest.json`).

---

## 2. Manifest Schema Example

```json
{
  "datasets": [
    {
      "name": "MIT-BIH Arrhythmia Database",
      "path": "datasets/raw/mitbih/",
      "frequency_hz": 360,
      "signals": ["ECG"]
    }
  ]
}
```
