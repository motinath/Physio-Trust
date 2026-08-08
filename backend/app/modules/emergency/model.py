import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from backend.app.db.session import Base


class WarningRecord(Base):
    __tablename__ = "warnings"

    warning_id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="MEDIUM")
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
