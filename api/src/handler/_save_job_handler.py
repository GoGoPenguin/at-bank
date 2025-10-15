from typing import cast

from dependency_injector.wiring import Provide
from fastapi import Request, status
from fastapi.responses import Response

from src.document import AthleticTrainer
from src.service import JobService, UserService


class SaveJobHandler:
    job_service: JobService = Provide["job_service"]
    user_service: UserService = Provide["user_service"]

    def handle(self, request: Request, id: str) -> Response:
        user = self.user_service.get_user_by_account(request.state.access_token.account)
        self.job_service.save_job(cast(AthleticTrainer, user), id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
