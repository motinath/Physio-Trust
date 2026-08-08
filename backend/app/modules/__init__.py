from fastapi import APIRouter
from backend.app.modules.auth.api import router as auth_router
from backend.app.modules.patients.api import router as patients_router
from backend.app.modules.ecg.api import router as ecg_router
from backend.app.modules.wearable.api import router as wearable_router
from backend.app.modules.dashboard.api import router as dashboard_router
from backend.app.modules.reports.api import router as reports_router
from backend.app.modules.notifications.api import router as notifications_router
from backend.app.modules.emergency.api import router as emergency_router
from backend.app.modules.ai.api import router as ai_router
from backend.app.modules.trust_engine.api import router as trust_router
from backend.app.modules.datasets.api import router as datasets_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(patients_router)
api_router.include_router(ecg_router)
api_router.include_router(wearable_router)
api_router.include_router(dashboard_router)
api_router.include_router(reports_router)
api_router.include_router(notifications_router)
api_router.include_router(emergency_router)
api_router.include_router(ai_router)
api_router.include_router(trust_router)
api_router.include_router(datasets_router)

