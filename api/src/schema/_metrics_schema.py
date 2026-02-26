from typing import Optional

from pydantic import BaseModel, Field

from src.utils.glossary import MetricsType


class MetricsSchema(BaseModel):
    name: MetricsType = Field(description="Type of the metric")
    value: int = Field(description="Value of the metric")
    unit: str = Field(description="Unit of the metric", default="")
    notes: Optional[str] = Field(
        description="Additional notes about the metric", default=None
    )
    metadata: Optional[dict] = Field(
        description="Additional metadata for the metric", default=None
    )
