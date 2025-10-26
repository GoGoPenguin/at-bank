from typing import Union, cast

from dependency_injector.wiring import Provide
from fastapi import Path, Request

from src.document import DepartmentJob, TournamentJob, User
from src.schema import DepartmentJobSchema, IndividualJobSchema, TournamentJobSchema
from src.service import JobService


class GetJobHandler:
    job_service: JobService = Provide["job_service"]

    def handle(
        self,
        request: Request,
        id: str = Path(
            title="The ID of the job to retrieve", pattern=r"^[a-f0-9]{24}$"
        ),
    ) -> Union[TournamentJobSchema, DepartmentJobSchema, IndividualJobSchema]:
        job = self.job_service.get_job(id, cast(User, request.state.user))
        return (
            TournamentJobSchema(**job.to_dict())
            if isinstance(job, TournamentJob)
            else DepartmentJobSchema(**job.to_dict())
            if isinstance(job, DepartmentJob)
            else IndividualJobSchema(**job.to_dict())
        )
