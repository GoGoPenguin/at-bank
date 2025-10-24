from typing import Annotated, cast

from dependency_injector.wiring import Provide
from fastapi import Query, Request

from src.document import DepartmentJob, IndividualJob, User
from src.schema import (
    DepartmentJobSchema,
    GetJobsRequestSchema,
    IndividualJobSchema,
    PaginationSchema,
    TournamentJobSchema,
)
from src.service import JobService


class GetJobsHandler:
    job_service: JobService = Provide["job_service"]

    def handle(
        self, request: Request, params: Annotated[GetJobsRequestSchema, Query()]
    ) -> PaginationSchema:
        jobs, pagination = self.job_service.get_jobs(
            cast(User, request.state.user), params
        )

        return PaginationSchema(
            data=[
                IndividualJobSchema(**job.to_dict())
                if isinstance(job, IndividualJob)
                else DepartmentJobSchema(**job.to_dict())
                if isinstance(job, DepartmentJob)
                else TournamentJobSchema(**job.to_dict())
                for job in jobs
            ],
            total_items=pagination[0],
            total_pages=pagination[1],
        )
