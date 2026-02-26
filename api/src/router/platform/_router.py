from fastapi import APIRouter

from src import handler
from src.utils.glossary import HttpMethod

from . import _auth_router as auth
from . import _equipment_router as equipment
from . import _job_router as job
from . import _user_router as user

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(user.router, prefix="/user", tags=["user"])
router.include_router(job.router, prefix="/jobs", tags=["jobs"])
router.include_router(equipment.router, prefix="/equipments", tags=["equipments"])
router.add_api_route(
    name="Ping",
    path="/ping",
    methods=[HttpMethod.GET],
    endpoint=handler.PingHandler().handle,
    tags=["health check"],
)
