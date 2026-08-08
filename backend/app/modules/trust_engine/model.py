import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


class ContextRecord(Base):
    __tablename__ = "context"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
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


class BaselineRecord(Base):
    __tablename__ = "baselines"

    baseline_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metric = Column(String(50), nullable=False)
    value = Column(Float, nullable=False)
    confidence = Column(Float, default=0.95)
    last_updated = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="baselines")


class HealthMemoryRecord(Base):
    __tablename__ = "health_memory"

    memory_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
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
    generated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="recommendations")
