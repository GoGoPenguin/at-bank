from typing import cast

from dependency_injector.wiring import Provide
from fastapi import Request, status
from fastapi.responses import Response

from src.document import AthleticTrainer
from src.service import JobService


class SaveJobHandler:
    job_service: JobService = Provide["job_service"]

    def handle(self, request: Request, id: str) -> Response:
        self.job_service.save_job(cast(AthleticTrainer, request.state.user), id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
