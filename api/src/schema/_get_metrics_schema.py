from typing import Optional

from pydantic import BaseModel, Field

from src.utils.glossary import MetricsType


class GetMetricsSchema(BaseModel):
    name: Optional[MetricsType] = Field(
        ..., description="The type of metric to filter by"
    )
    start_time: Optional[str] = Field(
        None, description="The start time for filtering metrics (ISO 8601 format)"
    )
    end_time: Optional[str] = Field(
        None, description="The end time for filtering metrics (ISO 8601 format)"
    )
    limit: Optional[int] = Field(
        10, description="The maximum number of metrics to return"
    )
    offset: Optional[int] = Field(
        0,
        description="The number of metrics to skip before starting to collect the result set",
    )
