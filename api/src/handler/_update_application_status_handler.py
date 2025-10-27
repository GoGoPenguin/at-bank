from dependency_injector.wiring import Provide
from fastapi import Request

from src.document import Department
from src.errors import ForbiddenError
from src.schema import ApplicantSchema, UpdateApplicationStatusSchema
from src.service import JobService


class UpdateApplicationStatusHandler:
    job_service: JobService = Provide["job_service"]

    def handle(
        self, request: Request, param: UpdateApplicationStatusSchema
    ) -> ApplicantSchema:
        if not isinstance(request.state.user, Department):
            raise ForbiddenError(
                detail="Only departments can update application status."
            )

        application = self.job_service.update_application_status(
            param.application_id, param.status
        )
        return ApplicantSchema(**application.to_dict())
