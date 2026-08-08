from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.modules.reports.model import ReportRecord
from backend.app.modules.patients.service import get_or_create_user

router = APIRouter()


@router.get("/reports")
def get_user_reports(subject_id: str = "100", db: Session = Depends(get_db)):
    user = get_or_create_user(db, subject_id=subject_id)
    recs = db.query(ReportRecord).filter(ReportRecord.user_id == user.id).all()
    return {
        "subject_id": subject_id,
        "reports": [
            {
                "id": r.id,
                "daily_report": r.daily_report,
                "weekly_report": r.weekly_report,
                "created_at": r.created_at.isoformat()
            } for r in recs
        ]
    }


@router.post("/reports")
def create_user_report(subject_id: str = "100", daily_report: str = "", weekly_report: str = "", db: Session = Depends(get_db)):
    user = get_or_create_user(db, subject_id=subject_id)
    record = ReportRecord(user_id=user.id, daily_report=daily_report, weekly_report=weekly_report)
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"status": "success", "report_id": record.id}
