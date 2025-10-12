from fastapi import APIRouter
from src import handler
from src.utils.glossary import HttpMethod

from . import _auth_router as auth
from . import _user_router as user

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(user.router, prefix="/user", tags=["user"])
router.add_api_route(
    name="Ping",
    path="/ping",
    methods=[HttpMethod.GET],
    endpoint=handler.PingHandler().handle,
)
