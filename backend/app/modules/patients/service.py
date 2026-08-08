from sqlalchemy.orm import Session
from backend.app.modules.patients.model import User
from typing import List, Optional


DEMO_PATIENTS = [
    {
        "subject_id": "100",
        "name": "Patient 1 — Healthy Baseline (MIT-BIH NSR)",
        "age": 32,
        "gender": "male",
        "height_cm": 176.0,
        "weight_kg": 72.0,
        "fitness_level": "High (Athlete)",
        "blood_group": "O+",
        "medical_history": "Normal Sinus Rhythm Baseline, Unremarkable Cardiac History",
        "medications": "None",
        "allergies": "No known allergies",
        "emergency_contact_name": "Primary Kin Contact",
        "emergency_contact_phone": "+1 (800) 555-0100",
        "device_id": "PT-NSR-100",
        "device_type": "PhysioTrust Single-Lead Patch",
        "battery_pct": 98,
        "firmware_version": "v2.4.1",
        "ble_rssi": -58,
        "resting_hr_bpm": 71.0,
        "resting_hrv_rmssd": 52.0,
        "spo2_baseline_pct": 99.0,
        "bp_systolic": 118,
        "bp_diastolic": 76,
        "respiration_rate": 14.5,
        "body_temp_c": 36.6,
        "baseline_variance": 0.012,
    },
    {
        "subject_id": "101",
        "name": "Patient 2 — Cardiac Arrhythmia (MIT-BIH Arrhythmia)",
        "age": 64,
        "gender": "male",
        "height_cm": 168.0,
        "weight_kg": 84.0,
        "fitness_level": "Low",
        "blood_group": "A+",
        "medical_history": "Paroxysmal Atrial Fibrillation, Frequent PVCs/PACs, Mild Hypertension",
        "medications": "Metoprolol 50mg BID, Apixaban 5mg BID",
        "allergies": "Penicillin",
        "emergency_contact_name": "Cardiology Response Team",
        "emergency_contact_phone": "+1 (800) 555-0101",
        "device_id": "PT-ARR-101",
        "device_type": "PhysioTrust Holter Monitor",
        "battery_pct": 82,
        "firmware_version": "v2.4.1",
        "ble_rssi": -65,
        "resting_hr_bpm": 88.0,
        "resting_hrv_rmssd": 22.0,
        "spo2_baseline_pct": 96.0,
        "bp_systolic": 142,
        "bp_diastolic": 92,
        "respiration_rate": 19.0,
        "body_temp_c": 37.0,
        "baseline_variance": 0.085,
    },
    {
        "subject_id": "200",
        "name": "Patient 3 — ICU Multi-Sensor Patient (MIMIC Waveform)",
        "age": 58,
        "gender": "female",
        "height_cm": 162.0,
        "weight_kg": 68.0,
        "fitness_level": "Bedridden / ICU",
        "blood_group": "B+",
        "medical_history": "Post-operative Surveillance, Multi-System Hemodynamic Monitoring",
        "medications": "IV Fentanyl, Cefazolin, Continuous Heparin",
        "allergies": "Sulfa Antibiotics",
        "emergency_contact_name": "ICU Duty Supervisor",
        "emergency_contact_phone": "+1 (800) 555-0200",
        "device_id": "PT-ICU-200",
        "device_type": "PhysioTrust Multi-Sensor Bedside Array",
        "battery_pct": 100,
        "firmware_version": "v3.0.0-ICU",
        "ble_rssi": -42,
        "resting_hr_bpm": 94.0,
        "resting_hrv_rmssd": 18.5,
        "spo2_baseline_pct": 94.0,
        "bp_systolic": 108,
        "bp_diastolic": 68,
        "respiration_rate": 22.0,
        "body_temp_c": 37.4,
        "baseline_variance": 0.045,
    },
]


def get_or_create_user(db: Session, subject_id: str, name: str = None, age: int = None, gender: str = None) -> User:
    user = db.query(User).filter(User.subject_id == subject_id).first()
    if not user:
        # Check if subject_id matches a known demo configuration
        match_cfg = next((p for p in DEMO_PATIENTS if p["subject_id"] == str(subject_id)), None)
        if match_cfg:
            user = User(**match_cfg)
        else:
            user = User(
                subject_id=subject_id,
                name=name or f"Subject #{subject_id}",
                age=age or 45,
                gender=gender or "unspecified",
                baseline_variance=0.0
            )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def list_users(db: Session) -> List[User]:
    users = db.query(User).all()
    if not users or len(users) < 3:
        for p in DEMO_PATIENTS:
            get_or_create_user(db, subject_id=p["subject_id"])
        users = db.query(User).all()
    return users



def update_user_baseline(db: Session, subject_id: str, baseline_variance: float) -> Optional[User]:
    user = db.query(User).filter(User.subject_id == subject_id).first()
    if user:
        user.baseline_variance = baseline_variance
        db.commit()
        db.refresh(user)
    return user
