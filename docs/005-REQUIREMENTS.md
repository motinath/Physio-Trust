# Task 0.5 — Product Requirements (`docs/005-REQUIREMENTS.md`)

# PhysioTrust Functional & Non-Functional Requirements Specification

---

## 1. Functional Requirements (FR)

### Data Ingestion & Preprocessing
- **FR-01**: The system **SHALL** ingest 1-lead and multi-lead ECG signals from standard MIT-BIH WFDB record format (`.hea`, `.dat`, `.atr`) and raw numerical array payloads.
- **FR-02**: The system **SHALL** execute a Butterworth bandpass filter ($0.5\text{ Hz} – 50\text{ Hz}$, order=4) to remove baseline wander and powerline noise.
- **FR-03**: The system **SHALL** compute Z-score signal normalization ($\mu = 0, \sigma = 1$).
- **FR-04**: The system **SHALL** segment continuous signals into fixed non-overlapping or overlapping sliding windows (default window duration: $5.0\text{ seconds}$).

### Signal Quality Engine (SQI)
- **FR-05**: The system **SHALL** extract 5 core quality metrics per window: Variance, Shannon Entropy, SNR Proxy (dB), Zero Crossing Rate (ZCR), and Kurtosis.
- **FR-06**: The system **SHALL** map extracted features into non-linear sub-scores ($0.0 – 1.0$) for Entropy, Kurtosis, and Variance.

### Trust Engine & Context Gatekeeper
- **FR-07**: The system **SHALL** compute a combined weighted Reliability Score ($0.0 – 1.0$) combining Entropy, Kurtosis, and Variance sub-scores.
- **FR-08**: The system **SHALL** evaluate reliability scores against dynamic activity-context thresholds:
  - `rest`: $0.60$
  - `sleep`: $0.70$
  - `walking`: $0.40$
  - `running`: $0.30$
- **FR-09**: The system **SHALL** output a binary decision (`ACCEPTED` / `DISCARDED`) along with explicit gatekeeper reasoning.

### Personalization & Explainable AI
- **FR-10**: The system **SHALL** maintain a personalized baseline memory per subject tracking historical variance and HRV metrics.
- **FR-11**: The system **SHALL** update personalized baseline memory **only** when incoming data windows are validated as `ACCEPTED` by the Context Gatekeeper.
- **FR-12**: The system **SHALL** generate natural language explanations detailing factor attributions and baseline comparison deltas for every processed window.

### API & Interface
- **FR-13**: The system **SHALL** expose REST endpoints:
  - `GET /api/v1/health`
  - `POST /api/v1/process`
  - `GET /api/v1/baseline/{subject_id}`
- **FR-14**: The system **SHALL** expose a real-time WebSocket endpoint (`WS /ws/ecg-stream`) streaming 360Hz ECG sample chunks and on-the-fly trust evaluations.
- **FR-15**: The system **SHALL** provide an interactive dashboard displaying dual-trace ECG oscilloscope, SVG radial trust gauge, activity context toggles, explainability cards, and CSV summary export.

---

## 2. Non-Functional Requirements (NFR)

### Performance & Latency
- **NFR-01 (Speed)**: Single 5.0-second window feature extraction and trust engine evaluation **MUST** complete in $< 10\text{ ms}$ on standard CPU hardware.
- **NFR-02 (Streaming Latency)**: WebSocket real-time streaming frame updates **MUST** maintain $< 50\text{ ms}$ latency (~20 FPS UI refresh).
- **NFR-03 (Batch Throughput)**: Full 30-minute record processing (361 windows) **MUST** complete in $< 1.5\text{ seconds}$.

### Accuracy & Reliability
- **NFR-04 (SQI Discrimination)**: Trust Engine **MUST** reliably discriminate between clean ECG (Score $> 0.70$) and severe flatline/motion artifact (Score $< 0.30$).
- **NFR-05 (Deterministic Output)**: For identical signal inputs and context states, trust scores and explanations **MUST** be 100% reproducible.

### Modularity & Maintainability
- **NFR-06 (Decoupled Engine)**: Core `physiotrust` engine package **MUST** have zero dependencies on web framework libraries (FastAPI/React) and be independently testable via unit tests.
- **NFR-07 (Pure NumPy Loader)**: MIT-BIH dataset loader **MUST** operate using pure NumPy binary unpacking without requiring external C-extension DLLs.

### Usability & Security
- **NFR-08 (Monochrome Design)**: Dashboard UI **MUST** adhere to Nothing Tech minimalist design standards (black/white/gray high-contrast, no neon colors).
- **NFR-09 (Containerization)**: Platform **MUST** build cleanly in Docker containers (`deployment/Dockerfile`) and run via `docker-compose`.
- **NFR-10 (Compliance Readiness)**: API schemas and dataset loaders **MUST** adhere to clinical privacy guidelines, ensuring no unhashed PII is transmitted across REST/WS interfaces.
