from backend.app.modules.patients.model import User
from backend.app.modules.ecg.model import SignalRecord
from backend.app.modules.reports.model import ReportRecord
from backend.app.modules.trust_engine.model import (
    ContextRecord, TrustRecord, BaselineRecord, HealthMemoryRecord,
    TrendRecord, RecommendationRecord
)
from backend.app.modules.ai.model import (
    ExplanationRecord, FeatureImportanceRecord, ReasonChainRecord,
    PredictionRecord, PredictionHistoryRecord, ForecastRecord, RiskRecord
)
from backend.app.modules.emergency.model import WarningRecord
