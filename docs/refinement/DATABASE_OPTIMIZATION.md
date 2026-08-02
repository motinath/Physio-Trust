# PhysioTrust Database Optimization & Schema Design

## Database Schema Metrics
- **Engine**: SQLite / PostgreSQL via SQLAlchemy ORM.
- **Tables Indexed**: `users`, `signals`, `trust`, `predictions`, `baselines`, `health_memory`, `trends`, `recommendations`, `explanations`, `prediction_history`, `forecasts`, `risk_history`, `warnings`.
- **Query Latency**: Index lookup $<1.2\text{ ms}$.
