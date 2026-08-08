from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class UserCreate(BaseModel):
    subject_id: str = Field(..., description="Subject unique identifier (e.g. '100')")
    name: Optional[str] = Field("Anonymous Subject", description="Subject display name")
    age: Optional[int] = Field(30, description="Subject age")
    gender: Optional[str] = Field("unspecified", description="Subject gender")
    blood_group: Optional[str] = Field("A+", description="Subject blood group")
    emergency_contact_name: Optional[str] = Field(None, description="Emergency contact name")
    emergency_contact_phone: Optional[str] = Field(None, description="Emergency contact phone")


class UserResponse(BaseModel):
    id: int
    subject_id: str
    name: str
    age: int
    gender: str
    height_cm: Optional[float] = 175.0
    weight_kg: Optional[float] = 70.0
    fitness_level: Optional[str] = "Moderate"
    blood_group: Optional[str] = None
    medical_history: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    device_id: Optional[str] = "PT-MONITOR-01"
    device_type: Optional[str] = "PhysioTrust Patch v2"
    battery_pct: Optional[int] = 95
    firmware_version: Optional[str] = "v2.4.1"
    ble_rssi: Optional[int] = -62
    resting_hr_bpm: Optional[float] = 72.0
    resting_hrv_rmssd: Optional[float] = 45.0
    spo2_baseline_pct: Optional[float] = 98.0
    bp_systolic: Optional[int] = 120
    bp_diastolic: Optional[int] = 80
    respiration_rate: Optional[float] = 16.0
    body_temp_c: Optional[float] = 36.8
    baseline_variance: float

    model_config = ConfigDict(from_attributes=True)



class ProfileResponse(BaseModel):
    subject_id: str
    resting_hr_bpm: float
    resting_hrv_rmssd: float
    normal_hr_range_min: float
    normal_hr_range_max: float
    recovery_rate_bpm_per_min: float
    total_monitored_days: int
