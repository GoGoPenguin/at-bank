from typing import Optional, cast

from src.document import Client, Metrics
from src.utils.glossary import MetricsType


class MetricsService:
    def get_metric(
        self,
        user: Client,
        metric_id: str,
    ) -> Optional[Metrics]:
        return cast(Optional[Metrics], Metrics.objects(id=metric_id, user=user).first())

    def get_metrics(
        self,
        user: Client,
        name: Optional[MetricsType] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> list[Metrics]:
        query = Metrics.objects(user=user)

        if name:
            query = query.filter(name=name)
        if start_time:
            query = query.filter(created_at__gte=start_time)
        if end_time:
            query = query.filter(created_at__lte=end_time)

        if offset is not None:
            query = query.skip(offset)
        if limit is not None:
            query = query.limit(limit)

        return list(query.all())

    def create_metrics(
        self,
        user: Client,
        name: MetricsType,
        value: int,
        unit: Optional[str] = None,
        notes: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> Metrics:
        metrics = Metrics(
            user=user,
            name=name,
            value=value,
            unit=unit,
            notes=notes,
            metadata=metadata or {},
        )
        metrics.save()
        return metrics

    def bulk_create_metrics(self, metrics_list: list[Metrics]) -> list[Metrics]:
        for metrics in metrics_list:
            metrics.save()
        return metrics_list
