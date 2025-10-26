from typing import Annotated, List

from dependency_injector.wiring import Provide
from fastapi import Query, Request

from src.document import Department
from src.errors import ForbiddenError
from src.schema import ApplicantSchema, GetApplicantsSchema
from src.service import JobService


class GetApplicantsHandler:
    job_service: JobService = Provide["job_service"]

    def handle(
        self, request: Request, params: Annotated[GetApplicantsSchema, Query()]
    ) -> List[ApplicantSchema]:
        if not isinstance(request.state.user, Department):
            raise ForbiddenError(detail="Only departments can view applicants.")

        applications = self.job_service.get_applicants(
            request.state.user, params.job_id
        )
        return [ApplicantSchema(**applicant.to_dict()) for applicant in applications]
