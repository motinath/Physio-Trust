# PhysioTrust REST API Specification

## Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health status and dataset manifest |
| `GET` | `/api/v1/users` | List registered user profiles |
| `POST` | `/api/v1/users` | Create a new user profile |
| `GET` | `/api/v1/signals` | List ingested physiological signals |
| `POST` | `/api/v1/signals` | Upload a raw signal stream |
| `GET` | `/api/v1/dashboard` | Aggregate telemetry dashboard summary |
| `GET` | `/api/v1/waveform` | Waveform window samples for visualizer |
| `POST` | `/api/v1/process` | Batch record processing and database persistence |
| `WS` | `/ws/ecg-stream` | Real-time WebSocket ECG streaming |
