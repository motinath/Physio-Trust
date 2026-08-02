import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), default="Anonymous Subject")
    age = Column(Integer, default=30)
    gender = Column(String(20), default="unspecified")
    height_cm = Column(Float, default=175.0)
    weight_kg = Column(Float, default=70.0)
    fitness_level = Column(String(50), default="Moderate")
    baseline_variance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    signals = relationship("SignalRecord", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("ReportRecord", back_populates="user", cascade="all, delete-orphan")
    baselines = relationship("BaselineRecord", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("HealthMemoryRecord", back_populates="user", cascade="all, delete-orphan")
    trends = relationship("TrendRecord", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("RecommendationRecord", back_populates="user", cascade="all, delete-orphan")


class SignalRecord(Base):
    __tablename__ = "signals"

    signal_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    signal_type = Column(String(50), default="ECG")
    raw_signal = Column(Text, nullable=True)
    sampling_rate = Column(Float, default=360.0)

    user = relationship("User", back_populates="signals")
    trust_records = relationship("TrustRecord", back_populates="signal", cascade="all, delete-orphan")
    predictions = relationship("PredictionRecord", back_populates="signal", cascade="all, delete-orphan")


class ContextRecord(Base):
    __tablename__ = "context"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    activity = Column(String(50), default="rest")
    location = Column(String(100), nullable=True)
    confidence = Column(Float, default=1.0)


class TrustRecord(Base):
    __tablename__ = "trust"

    id = Column(Integer, primary_key=True, index=True)
    signal_id = Column(Integer, ForeignKey("signals.signal_id"), nullable=True)
    quality_score = Column(Float, default=0.0)
    trust_score = Column(Float, default=0.0)
    explanation = Column(Text, nullable=True)
    quality_metrics_json = Column(JSON, nullable=True)

    signal = relationship("SignalRecord", back_populates="trust_records")


class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    signal_id = Column(Integer, ForeignKey("signals.signal_id"), nullable=True)
    prediction = Column(String(100), default="Normal Rhythm")
    probability = Column(Float, default=0.95)

    signal = relationship("SignalRecord", back_populates="predictions")


class ReportRecord(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    daily_report = Column(Text, nullable=True)
    weekly_report = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reports")


# PHASE 4 DATABASE TABLES
class BaselineRecord(Base):
    __tablename__ = "baselines"

    baseline_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metric = Column(String(50), nullable=False)
    value = Column(Float, nullable=False)
    confidence = Column(Float, default=0.95)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="baselines")


class HealthMemoryRecord(Base):
    __tablename__ = "health_memory"

    memory_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    metric = Column(String(50), nullable=False)
    value = Column(Float, nullable=False)

    user = relationship("User", back_populates="memories")


class TrendRecord(Base):
    __tablename__ = "trends"

    trend_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metric = Column(String(50), nullable=False)
    trend_type = Column(String(50), default="STABLE")
    value = Column(Float, default=0.0)
    confidence = Column(Float, default=0.90)

    user = relationship("User", back_populates="trends")


class RecommendationRecord(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String(20), default="MEDIUM")
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="recommendations")


# PHASE 5 DATABASE TABLES
class ExplanationRecord(Base):
    __tablename__ = "explanations"

    explanation_id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, nullable=True)
    reason = Column(Text, nullable=False)
    confidence = Column(Float, default=0.95)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


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


# PHASE 6 DATABASE TABLES
class PredictionHistoryRecord(Base):
    __tablename__ = "prediction_history"

    prediction_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    metric = Column(String(50), nullable=False)
    predicted_value = Column(Float, nullable=False)
    confidence = Column(Float, default=0.92)
    prediction_time = Column(DateTime, default=datetime.datetime.utcnow)


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
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)


class WarningRecord(Base):
    __tablename__ = "warnings"

    warning_id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="MEDIUM")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
