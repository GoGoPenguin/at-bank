from typing import cast

from dependency_injector.wiring import Provide
from fastapi import Request, status
from fastapi.responses import Response

from src.document import AthleticTrainer
from src.errors import UnauthorizedError
from src.schema import ApplyToJobSchema
from src.service import JobService, UserService


class ApplyToJobHandler:
    job_service: JobService = Provide["job_service"]
    user_service: UserService = Provide["user_service"]

    def handle(self, request: Request, params: ApplyToJobSchema):
        user = self.user_service.get_user_by_account(request.state.access_token.account)
        if user is None:
            raise UnauthorizedError(detail="User not found.")

        self.job_service.apply_to_job(
            cast(AthleticTrainer, user), params.job_id, params.available_slots
        )
        return Response(status_code=status.HTTP_204_NO_CONTENT)
