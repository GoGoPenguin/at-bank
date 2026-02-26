from typing import List

from pydantic import RootModel

from ._metrics_schema import MetricsSchema


class CreateMetricsSchema(RootModel[List[MetricsSchema]]):
    pass
