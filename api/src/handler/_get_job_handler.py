from typing import Union

from dependency_injector.wiring import Provide
from fastapi import Request

from src.document import DepartmentJob, TournamentJob
from src.errors._errors import UnauthorizedError
from src.schema import DepartmentJobSchema, IndividualJobSchema, TournamentJobSchema
from src.service import JobService
from src.service._user_service import UserService


class GetJobHandler:
    user_service: UserService = Provide["user_service"]
    job_service: JobService = Provide["job_service"]

    def handle(
        self, id: str, request: Request
    ) -> Union[TournamentJobSchema, DepartmentJobSchema, IndividualJobSchema]:
        user = self.user_service.get_user_by_account(request.state.access_token.account)
        if user is None:
            raise UnauthorizedError(detail="User not found.")
        job = self.job_service.get_job(id, user)
        return (
            TournamentJobSchema(**job.to_dict())
            if isinstance(job, TournamentJob)
            else DepartmentJobSchema(**job.to_dict())
            if isinstance(job, DepartmentJob)
            else IndividualJobSchema(**job.to_dict())
        )
