from typing import Optional

from dependency_injector.wiring import Provide

from src.schema import JobSchema
from src.service import JobService


class GetJobHandler:
    job_service: JobService = Provide["job_service"]

    def handle(self, id: str) -> Optional[JobSchema]:
        job = self.job_service.get_job(id)
        return JobSchema(**job.to_dict()) if job else None
