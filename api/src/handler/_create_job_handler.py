from typing import Union, cast

from dependency_injector.wiring import Provide
from fastapi import Request

from src.document import Department, DepartmentJob, IndividualJob, User
from src.errors import ForbiddenError
from src.schema import (
    CreateJobRequestSchema,
    DepartmentJobSchema,
    IndividualJobSchema,
    TournamentJobSchema,
)
from src.service import JobService


class CreateJobHandler:
    job_service: JobService = Provide["job_service"]

    def handle(
        self, request: Request, params: CreateJobRequestSchema
    ) -> Union[IndividualJobSchema, DepartmentJobSchema, TournamentJobSchema]:
        user = cast(User, request.state.user)
        if not isinstance(user, Department):
            raise ForbiddenError(detail="Only departments can create jobs.")

        job = self.job_service.create_job(user, params)
        if isinstance(job, DepartmentJob):
            return DepartmentJobSchema(**job.to_dict())
        elif isinstance(job, IndividualJob):
            return IndividualJobSchema(**job.to_dict())
        else:
            return TournamentJobSchema(**job.to_dict())
