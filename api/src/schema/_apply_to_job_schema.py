from datetime import date
from typing import List

from pydantic import BaseModel, Field


class ApplyToJobSchema(BaseModel):
    job_id: str = Field(description="Unique identifier for the job to apply to")
    available_slots: List[date] = Field(
        description="List of available slots for the job application"
    )
