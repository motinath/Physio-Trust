# 010 — REPOSITORY ARCHITECTURE & DIRECTORY STRUCTURE (V2)

## 1. Overview
The **PhysioTrust** repository follows a **10-Layer AI-First Architecture**. The AI intelligence layers (`ai/`) are decoupled from data ingestion (`datasets/`), backend services (`backend/`), and user interface (`frontend/`).

```
physiotrust/
│
├── backend/                       # Layer 7 & 8: FastAPI REST & WebSocket Server
├── frontend/                      # Layer 7: Vite + React JS Dashboard
├── mobile/                        # Layer 7: Mobile SDK & Cross-Platform UI Shell
│
├── ai/                            # Layers 2 – 6: Core AI Intelligence Packages
│   ├── signal_quality/            # Layer 2: SQI Engine (SNR, noise, drift, kurtosis)
│   ├── trust/                     # Layer 2: Trust Engine & weighted reliability scoring
│   ├── context/                   # Layer 3: Activity recognition & motion gatekeeper
│   ├── personalization/           # Layer 4: Baseline learning, circadian rhythm & memory
│   ├── explainability/            # Layer 5: SHAP integration & natural language reasoning
│   ├── prediction/                # Layer 6: Trend forecasting & risk estimation
│   ├── recommendation/            # Layer 4/5: Contextual action recommendations
│   └── models/                    # Layer 2/4: Trained Machine Learning Ensemble models
│
├── signal_processing/             # Layer 2: Bandpass filters, windowing, segmentation, normalization
│
├── datasets/                      # Layer 1: Data Layer
│   ├── raw/                       # mitbih/, ppg_dalia/, wesad/, sleep_edf/, mimic_iv/
│   ├── processed/                 # Parsed & cleaned signal arrays
│   └── metadata/                  # dataset_manifest.json
│
├── deployment/                    # Layer 8 & 9: Dockerfile & docker-compose.yml
├── docs/                          # Layer 0 & Specifications (001 - 012 V2)
├── notebooks/                     # Exploratory research & model evaluation
├── tests/                         # Layer-by-layer automated test suite
├── scripts/                       # DevOps & dataset ingestion scripts
└── README.md
```

## 2. Layer Description Matrix

| Layer ID | Layer Name | Key Responsibilities | Directory Path |
| :--- | :--- | :--- | :--- |
| **Layer 1** | **Data Layer** | Public dataset management, metadata validation, raw binary unpacking | `datasets/` |
| **Layer 2** | **Signal Intelligence Layer** | Filtering, denoising, windowing, SQI Engine, Trust Engine, Fusion | `physiotrust/signal_processing/`, `physiotrust/ai/signal_quality/`, `physiotrust/ai/trust/` |
| **Layer 3** | **Context Intelligence Layer** | Activity recognition, motion artifact classification, context gatekeeper | `physiotrust/ai/context/` |
| **Layer 4** | **Personal Intelligence Layer** | Personal baseline learning, circadian rhythm, physiological memory | `physiotrust/ai/personalization/`, `physiotrust/ai/recommendation/` |
| **Layer 5** | **Explainable Intelligence Layer** | SHAP integration, factor attribution, natural language reasoning | `physiotrust/ai/explainability/` |
| **Layer 6** | **Predictive Intelligence Layer** | Recovery forecasting, fatigue prediction, stress trend estimation | `physiotrust/ai/prediction/` |
| **Layer 7** | **Interaction Layer** | React Dashboard, Mobile SDK, reports, visual oscilloscope | `frontend/`, `mobile/` |
| **Layer 8** | **Platform Layer** | REST APIs, WebSockets, SQLAlchemy ORM, developer SDK | `backend/` |
| **Layer 9** | **Enterprise Layer** | Clinical dashboard, compliance, Docker containerization | `deployment/` |
| **Layer 10** | **Device Layer (Future)** | Wearable & medical hardware connectivity (Apple Watch, ESP32) | `scripts/` |
