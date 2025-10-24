from typing import cast

from dependency_injector.wiring import Provide
from fastapi import Request, status
from fastapi.responses import Response

from src.document import AthleticTrainer
from src.schema import ApplyToJobSchema
from src.service import JobService


class ApplyToJobHandler:
    job_service: JobService = Provide["job_service"]

    def handle(self, request: Request, params: ApplyToJobSchema):
        self.job_service.apply_to_job(
            cast(AthleticTrainer, request.state.user),
            params.job_id,
            params.available_slots,
        )
        return Response(status_code=status.HTTP_204_NO_CONTENT)
