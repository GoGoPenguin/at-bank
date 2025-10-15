from fastapi import APIRouter, status

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
router.add_api_route(
    name="Save Job",
    path="/{id}/save",
    methods=[HttpMethod.PATCH],
    endpoint=handler.SaveJobHandler().handle,
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Job saved successfully",
            "content": {},
        },
    },
)
router.add_api_route(
    name="Unsave Job",
    path="/{id}/unsave",
    methods=[HttpMethod.PATCH],
    endpoint=handler.UnsaveJobHandler().handle,
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Job unsaved successfully",
            "content": {},
        }
    },
)
