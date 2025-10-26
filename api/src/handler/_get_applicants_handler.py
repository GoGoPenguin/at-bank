from src.service import JobService
from dependency_injector.wiring import Provide
from fastapi import Request
from src.schema import GetApplicantsSchema, ApplicantSchema
from fastapi import Query
from typing import Annotated, List
from src.document import Department
from src.errors import ForbiddenError


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
