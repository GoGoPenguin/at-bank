from typing import Union

from dependency_injector.wiring import Provide
from fastapi import Request

from src.document import Department, DepartmentJob, IndividualJob
from src.errors import ForbiddenError, UnauthorizedError
from src.schema import (
    CreateJobRequestSchema,
    DepartmentJobSchema,
    IndividualJobSchema,
    TournamentJobSchema,
)
from src.service import JobService, UserService


class CreateJobHandler:
    job_service: JobService = Provide["job_service"]
    user_service: UserService = Provide["user_service"]

    def handle(
        self, request: Request, params: CreateJobRequestSchema
    ) -> Union[IndividualJobSchema, DepartmentJobSchema, TournamentJobSchema]:
        user = self.user_service.get_user_by_account(request.state.access_token.account)
        if user is None:
            raise UnauthorizedError(detail="User not found.")
        if not isinstance(user, Department):
            raise ForbiddenError(detail="Only departments can create jobs.")

        job = self.job_service.create_job(user, params)
        if isinstance(job, DepartmentJob):
            return DepartmentJobSchema(**job.to_dict())
        elif isinstance(job, IndividualJob):
            return IndividualJobSchema(**job.to_dict())
        else:
            return TournamentJobSchema(**job.to_dict())
