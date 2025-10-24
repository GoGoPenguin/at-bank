from dependency_injector.wiring import Provide
from fastapi import Request

from src.document import Department
from src.errors import ForbiddenError
from src.schema import JobSchema, UpdateJobStatusSchema
from src.service import JobService


class UpdateJobStatusHandler:
    job_service: JobService = Provide["job_service"]

    def handle(self, params: UpdateJobStatusSchema, request: Request) -> JobSchema:
        if not isinstance(request.state.user, Department):
            raise ForbiddenError(detail="Only departments can update job status.")

        job = self.job_service.update_job_status(params.job_id, params.status)
        return JobSchema(**job.to_dict())
