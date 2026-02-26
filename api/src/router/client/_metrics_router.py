from fastapi import APIRouter

from src import handler
from src.utils.glossary import HttpMethod

router = APIRouter()

router.add_api_route(
    name="Get Metrics",
    path="/",
    methods=[HttpMethod.GET],
    endpoint=handler.GetMetricsHandler().handle,
)
router.add_api_route(
    name="Create Metrics",
    path="/",
    methods=[HttpMethod.POST],
    endpoint=handler.CreateMetricsHandler().handle,
)
