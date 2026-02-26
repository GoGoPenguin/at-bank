from typing import List

from dependency_injector.wiring import Provide
from fastapi import Request

from src.schema._metrics_schema import MetricsSchema
from src.service import MetricsService


class GetMetricsHandler:
    metrics_service: MetricsService = Provide["metrics_service"]

    def handle(self, request: Request) -> List[MetricsSchema]:
        user = request.state.user
        metrics = self.metrics_service.get_metrics(user=user)
        return [MetricsSchema(**metric.to_dict()) for metric in metrics]
