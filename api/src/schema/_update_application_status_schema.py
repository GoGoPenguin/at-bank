from pydantic import BaseModel, Field

from src.utils.glossary import JobApplicationStatus


class UpdateApplicationStatusSchema(BaseModel):
    application_id: str = Field(description="ID of the job application to update")
    status: JobApplicationStatus = Field(
        description="New status for the job application"
    )
