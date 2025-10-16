from typing import Annotated

from dependency_injector.wiring import Provide
from fastapi import Query, Request

from src.document import DepartmentJob, IndividualJob
from src.errors import UnauthorizedError
from src.schema import (
    DepartmentJobSchema,
    GetJobsRequestSchema,
    IndividualJobSchema,
    PaginationSchema,
    TournamentJobSchema,
)
from src.service import JobService, UserService


class GetJobsHandler:
    job_service: JobService = Provide["job_service"]
    user_service: UserService = Provide["user_service"]

    def handle(
        self, request: Request, params: Annotated[GetJobsRequestSchema, Query()]
    ) -> PaginationSchema:
        user = self.user_service.get_user_by_account(request.state.access_token.account)
        if user is None:
            raise UnauthorizedError(detail="User not found.")
        jobs, pagination = self.job_service.get_jobs(user, params)

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
