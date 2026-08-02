import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.api.routes import router as api_router
from backend.app.websocket.stream import router as ws_router

app = FastAPI(
    title="PhysioTrust AI Platform",
    description="PhysioTrust transforms physiological measurements into trustworthy, explainable, personalized, and predictive physiological intelligence.",
    version="1.0.0-RC1"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(api_router, prefix="/api/v1", tags=["API"])
app.include_router(ws_router, tags=["WebSocket"])

# Mount Frontend Static Directory (dist if built, otherwise frontend root)
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
frontend_raw = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))

if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
elif os.path.exists(frontend_raw):
    app.mount("/", StaticFiles(directory=frontend_raw, html=True), name="frontend")
