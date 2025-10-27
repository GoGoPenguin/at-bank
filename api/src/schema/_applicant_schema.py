from datetime import date, datetime
from typing import List, Union

from pydantic import BaseModel, Field

from src.utils.glossary import JobApplicationStatus

from ._job_schema import DepartmentJobSchema, IndividualJobSchema, TournamentJobSchema
from ._user_schema import AthleticTrainerSchema


class ApplicantSchema(BaseModel):
    id: str = Field(description="Applicant ID")
    job: Union[DepartmentJobSchema, IndividualJobSchema, TournamentJobSchema] = Field()
    applicant: AthleticTrainerSchema = Field()
    status: JobApplicationStatus = Field()
    available_slots: List[date] = Field(
        description="List of available slots for the job application"
    )
    created_at: datetime = Field(description="Date when the application was created")
