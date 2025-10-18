from fastapi import APIRouter

from src import handler
from src.utils.glossary import HttpMethod

router = APIRouter()

router.add_api_route(
    name="Get Equipment List",
    path="/",
    methods=[HttpMethod.GET],
    endpoint=handler.GetEquipmentsHandler().handle,
)
