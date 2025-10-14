"""
API v1 router
"""

from fastapi import APIRouter

from app.api.v1.endpoints import ai, data, knowledge, sessions

api_router = APIRouter()

api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(data.router, prefix="/data", tags=["data"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])