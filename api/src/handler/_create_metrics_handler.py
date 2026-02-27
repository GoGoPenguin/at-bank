from typing import cast

from dependency_injector.wiring import Provide
from fastapi import Request
from loguru import logger

from src.document import Client, Metrics, User
from src.errors._errors import ForbiddenError
from src.schema import CreateMetricsSchema, MetricsSchema
from src.service import MetricsService


class CreateMetricsHandler:
    metrics_service: MetricsService = Provide["metrics_service"]

    async def handle(
        self, request: Request, params: CreateMetricsSchema
    ) -> list[MetricsSchema]:
        user = cast(User, request.state.user)
        if not isinstance(user, Client):
            raise ForbiddenError("Only clients can create metrics.")

        logger.info(params.root)

        metrics = self.metrics_service.bulk_create_metrics(
            metrics_list=[
                Metrics(
                    user=user,
                    name=metric.name,
                    value=metric.value,
                    unit=metric.unit,
                    notes=metric.notes,
                    metadata=metric.metadata,
                )
                for metric in params.root
            ],
        )

        logger.info(f"Created {len(metrics)} metrics for user {user.id}")

        return [MetricsSchema(**metric.to_dict()) for metric in metrics]
