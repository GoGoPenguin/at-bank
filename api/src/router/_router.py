from fastapi import APIRouter

from . import client, platform

router = APIRouter()

router.include_router(platform.router, tags=["platform"])
router.include_router(client.router, prefix="/client", tags=["client"])
