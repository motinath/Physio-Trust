import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


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
    blood_group = Column(String(10), nullable=True, default="A+")
    medical_history = Column(String(255), nullable=True, default="None reported")
    medications = Column(String(255), nullable=True, default="None")
    allergies = Column(String(255), nullable=True, default="No known allergies")
    emergency_contact_name = Column(String(100), nullable=True)
    emergency_contact_phone = Column(String(50), nullable=True)
    device_id = Column(String(50), nullable=True, default="PT-MONITOR-01")
    device_type = Column(String(50), nullable=True, default="PhysioTrust Multi-Sensor Patch v2")
    battery_pct = Column(Integer, nullable=True, default=94)
    firmware_version = Column(String(20), nullable=True, default="v2.4.1")
    ble_rssi = Column(Integer, nullable=True, default=-62)
    resting_hr_bpm = Column(Float, nullable=True, default=72.0)
    resting_hrv_rmssd = Column(Float, nullable=True, default=45.0)
    spo2_baseline_pct = Column(Float, nullable=True, default=98.0)
    bp_systolic = Column(Integer, nullable=True, default=120)
    bp_diastolic = Column(Integer, nullable=True, default=80)
    respiration_rate = Column(Float, nullable=True, default=16.0)
    body_temp_c = Column(Float, nullable=True, default=36.8)
    baseline_variance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))


    signals = relationship("SignalRecord", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("ReportRecord", back_populates="user", cascade="all, delete-orphan")
    baselines = relationship("BaselineRecord", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("HealthMemoryRecord", back_populates="user", cascade="all, delete-orphan")
    trends = relationship("TrendRecord", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("RecommendationRecord", back_populates="user", cascade="all, delete-orphan")
