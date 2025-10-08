from fastapi import APIRouter
from src import handler
from src.utils.glossary import HttpMethod

router = APIRouter()

router.add_api_route(
    name="Ping",
    path="/ping",
    methods=[HttpMethod.GET],
    endpoint=handler.PingHandler(),
)
