from pydantic import BaseModel, Field
from typing import Optional


class GetApplicantsSchema(BaseModel):
    job_id: Optional[str] = Field(
        description="The unique identifier of the job posting", default=None
    )
    page: int = Field(1, description="The page number for pagination", ge=1)
    page_size: int = Field(
        10, description="The number of applicants per page", ge=1, le=100
    )
