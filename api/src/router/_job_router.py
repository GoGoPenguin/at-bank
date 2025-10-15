from fastapi import APIRouter

from src import handler
from src.utils.glossary import HttpMethod

router = APIRouter()

router.add_api_route(
    name="Get Job",
    path="/{id}",
    methods=[HttpMethod.GET],
    endpoint=handler.GetJobHandler().handle,
)
router.add_api_route(
    name="Get Jobs",
    path="/",
    methods=[HttpMethod.GET],
    endpoint=handler.GetJobsHandler().handle,
)
router.add_api_route(
    name="Create Job",
    path="/",
    methods=[HttpMethod.POST],
    endpoint=handler.CreateJobHandler().handle,
)
