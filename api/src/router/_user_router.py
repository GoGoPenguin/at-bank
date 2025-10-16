from fastapi import APIRouter

from src import handler
from src.utils.glossary import HttpMethod

router = APIRouter()

router.add_api_route(
    name="Get Me",
    path="/",
    methods=[HttpMethod.GET],
    endpoint=handler.GetMeHandler().handle,
)
router.add_api_route(
    name="Check Account",
    path="/{account}",
    methods=[HttpMethod.HEAD],
    endpoint=handler.CheckAccountHandler().handle,
)
