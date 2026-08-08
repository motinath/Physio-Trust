import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    signal_id = Column(Integer, ForeignKey("signals.signal_id"), nullable=True)
    prediction = Column(String(100), default="Normal Rhythm")
    probability = Column(Float, default=0.95)

    signal = relationship("SignalRecord", back_populates="predictions")


class ExplanationRecord(Base):
    __tablename__ = "explanations"

    explanation_id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, nullable=True)
    reason = Column(Text, nullable=False)
    confidence = Column(Float, default=0.95)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))


class FeatureImportanceRecord(Base):
    __tablename__ = "feature_importance"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, nullable=True)
    feature = Column(String(50), nullable=False)
    importance = Column(Float, nullable=False)


class ReasonChainRecord(Base):
    __tablename__ = "reason_chains"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, nullable=True)
    step_order = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)


class PredictionHistoryRecord(Base):
    __tablename__ = "prediction_history"

    prediction_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    metric = Column(String(50), nullable=False)
    predicted_value = Column(Float, nullable=False)
    confidence = Column(Float, default=0.92)
    prediction_time = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))


class ForecastRecord(Base):
    __tablename__ = "forecasts"

    forecast_id = Column(Integer, primary_key=True, index=True)
    metric = Column(String(50), nullable=False)
    future_time = Column(String(50), nullable=False)
    value = Column(Float, nullable=False)
    confidence = Column(Float, default=0.90)


class RiskRecord(Base):
    __tablename__ = "risk_history"

    risk_id = Column(Integer, primary_key=True, index=True)
    metric = Column(String(50), nullable=False)
    risk_level = Column(String(20), default="LOW")
    probability = Column(Float, default=0.15)
    generated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
