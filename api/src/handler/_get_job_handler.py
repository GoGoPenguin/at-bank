from typing import Union

from dependency_injector.wiring import Provide

from src.document import Department, TournamentJob
from src.schema import DepartmentJobSchema, IndividualJobSchema, TournamentJobSchema
from src.service import JobService


class GetJobHandler:
    job_service: JobService = Provide["job_service"]

    def handle(
        self, id: str
    ) -> Union[TournamentJobSchema, DepartmentJobSchema, IndividualJobSchema]:
        job = self.job_service.get_job(id)
        return (
            TournamentJobSchema(**job.to_dict())
            if isinstance(job, TournamentJob)
            else DepartmentJobSchema(**job.to_dict())
            if isinstance(job, Department)
            else IndividualJobSchema(**job.to_dict())
        )
