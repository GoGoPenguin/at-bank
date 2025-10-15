from typing import Optional

from pydantic import BaseModel, Field

from src.utils.glossary import Cities, JobType


class GetJobsRequestSchema(BaseModel):
    page: int = Field(1, description="Page number for pagination", ge=1)
    size: int = Field(10, description="Number of items per page", ge=1, le=100)
    city: Optional[Cities] = Field(None, description="Filter jobs by city")
    job_type: Optional[JobType] = Field(None, description="Filter jobs by job type")
