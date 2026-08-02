# PhysioTrust Phase 1 Architecture Overview

```
Physiological Dataset (MIT-BIH, PPG-DaLiA, WESAD, Sleep-EDF, MIMIC-IV)
        │
        ▼
Data Ingestion (load_ecg, load_ppg, load_hrv, load_sleep, load_context)
        │
        ▼
Signal Preprocessing (Butterworth 0.5-50Hz, Z-Score, Noise Removal, Windowing)
        │
        ▼
Database (SQLAlchemy ORM: Users, Signals, Context, Trust, Predictions, Reports)
        │
        ▼
Backend REST API & WebSockets (FastAPI / Uvicorn)
        │
        ▼
Multi-View React Dashboard (Dashboard, Users, Signals, Analytics, Settings)
```
