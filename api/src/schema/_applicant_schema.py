from pydantic import BaseModel, Field
from typing import Union, List
from ._user_schema import AthleticTrainerSchema
from ._job_schema import DepartmentJobSchema, IndividualJobSchema, TournamentJobSchema
from src.utils.glossary import JobApplicationStatus
from datetime import date


class ApplicantSchema(BaseModel):
    job: Union[DepartmentJobSchema, IndividualJobSchema, TournamentJobSchema] = Field()
    applicant: AthleticTrainerSchema = Field()
    status: JobApplicationStatus = Field()
    available_slots: List[date] = Field(
        description="List of available slots for the job application"
    )
