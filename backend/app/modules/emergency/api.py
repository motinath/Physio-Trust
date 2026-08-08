from fastapi import APIRouter
from physiotrust.ai.prediction.warning.warning_engine import EarlyWarningEngine

router = APIRouter()


@router.get("/warnings")
def get_early_warnings(subject_id: str = "100"):
    warnings = EarlyWarningEngine.get_active_warnings(subject_id=subject_id)
    return {"subject_id": subject_id, "warnings": [w.to_dict() for w in warnings]}
