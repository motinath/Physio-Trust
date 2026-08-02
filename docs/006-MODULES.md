# Task 0.6 — Functional Modules Specification (`docs/006-MODULES.md`)

# Functional Module Pipeline & Architecture

## 1. Module Pipeline Overview

PhysioTrust is structured into 9 decoupled, modular functional components:

```
[ 1. Data Acquisition ]
         │
         ▼
[ 2. Signal Processing ]
         │
         ▼
[ 3. Signal Quality Engine ]
         │
         ▼
[ 4. Context Engine ] ◄─── (Activity Input: Rest, Sleep, Walk, Run)
         │
         ▼
[ 5. Trust Engine ]
         │
         ▼
[ 6. Personalization Engine ] ─── (Learned Historical Memory)
         │
         ▼
[ 7. Explainable AI Engine ]
         │
         ▼
[ 8. Prediction Engine ]
         │
         ▼
[ 9. Dashboard & APIs ] ───► (REST / WebSockets / React UI)
```

---

## 2. Detailed Module Specifications

### Module 1: Data Acquisition (`physiotrust.datasets`)
- **Responsibility**: Ingests raw continuous biological signals from file storage or sensor streams.
- **Inputs**: WFDB files (`.dat`, `.hea`), raw NumPy arrays, or JSON payload streams.
- **Outputs**: Dictionary object containing 1D raw signal array, sampling rate $F_s$, record name, and sample count.
- **Implementation**: Pure NumPy 12-bit Format 212 binary parser for MIT-BIH records (`loaders.py`).

### Module 2: Signal Processing (`physiotrust.signal_processing`)
- **Responsibility**: Noise reduction, frequency bandpass filtering, Z-score standardization, and sliding window segmentation.
- **Inputs**: Raw signal array, sampling frequency $F_s$, window duration ($5.0\text{s}$), overlap.
- **Outputs**: Preprocessed 1D normalized clean signal array and 2D segmented window matrix.
- **Functions**: `bandpass_filter()`, `normalize_signal()`, `window_signal()`.

### Module 3: Signal Quality Engine (`physiotrust.trust_engine.quality`)
- **Responsibility**: Extracts statistical features and calculates normalized sub-scores ($0.0 – 1.0$).
- **Features Extracted**:
  - *Variance*: Identifies flatlines ($< 0.001$) or amplitude saturation.
  - *Shannon Entropy*: Measures structural noise vs regularity.
  - *SNR Proxy (dB)*: Evaluates signal power ratio.
  - *Zero Crossing Rate (ZCR)*: Flags high-frequency muscle artifacts.
  - *Kurtosis*: Measures QRS complex sharpness.
- **Outputs**: `QualityMetrics` object containing raw statistical features and mapped sub-scores.

### Module 4: Context Engine (`physiotrust.context_engine.gatekeeper`)
- **Responsibility**: Evaluates activity context and assigns dynamic reliability thresholds.
- **Context Profiles**:
  - `rest`: $0.60$ threshold
  - `sleep`: $0.70$ threshold
  - `walking`: $0.40$ threshold
  - `running`: $0.30$ threshold
- **Outputs**: `ContextEvaluationResult` object containing `is_reliable` binary flag, context name, threshold, and status text.

### Module 5: Trust Engine (`physiotrust.trust_engine.reliability`)
- **Responsibility**: Combines sub-scores using non-linear weighted sigmoid transformations into a unified Reliability Score ($0.0 – 1.0$).
- **Default Weights**: Entropy ($0.40$), Kurtosis ($0.40$), Variance ($0.20$).
- **Outputs**: `ReliabilityResult` object containing final score and quality metrics.

### Module 6: Personalization Engine (`physiotrust.personalization.baseline`)
- **Responsibility**: Builds individual physiological baseline memory over time.
- **Behavior**: Updates running baseline statistics (mean variance, baseline HRV) **only** when windows are marked `ACCEPTED` by the Context Gatekeeper.
- **Outputs**: Subject baseline mean, standard deviation, and historical sample count.

### Module 7: Explainable AI Engine (`physiotrust.explainability.explainer`)
- **Responsibility**: Translates raw feature scores and context decisions into human-readable text attributions.
- **Outputs**: Headline summary, factor attribution dictionary, confidence percentage, and baseline comparison statement.

### Module 8: Prediction Engine (`physiotrust.prediction.trends`)
- **Responsibility**: Analyzes multi-window trends, drift slopes, and physiological stability across continuous sessions.
- **Outputs**: Trend direction (`improving`, `stable`, `degrading`) and drift slope values.

### Module 9: Dashboard & APIs (`backend/app`, `frontend/src`)
- **Responsibility**: Serves REST endpoints (`/api/v1/process`, `/api/v1/health`), WebSocket streaming (`/ws/ecg-stream`), and the Vite + React JS user dashboard.
