import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


class SignalRecord(Base):
    __tablename__ = "signals"

    signal_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    signal_type = Column(String(50), default="ECG")
    raw_signal = Column(Text, nullable=True)
    sampling_rate = Column(Float, default=360.0)

    user = relationship("User", back_populates="signals")
    trust_records = relationship("TrustRecord", back_populates="signal", cascade="all, delete-orphan")
    predictions = relationship("PredictionRecord", back_populates="signal", cascade="all, delete-orphan")
