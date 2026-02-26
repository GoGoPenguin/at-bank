from fastapi import APIRouter

from . import _metrics_router as metrics

router = APIRouter()

router.include_router(metrics.router, prefix="/metrics", tags=["Metrics"])
