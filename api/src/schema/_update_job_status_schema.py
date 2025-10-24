from pydantic import BaseModel, Field

from src.utils.glossary import JobStatus


class UpdateJobStatusSchema(BaseModel):
    job_id: str = Field(description="Unique identifier for the job")
    status: JobStatus = Field(description="New status for the job")
