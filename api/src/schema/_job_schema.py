from typing import Optional

from pydantic import BaseModel, Field

from src.utils.glossary import JobApplicationStatus

from ._job_shit_schema import JobShiftSchema


class JobSchema(BaseModel):
    id: str = Field(description="Unique identifier for the job")
    title: str = Field(description="Job title")
    department_id: Optional[str] = Field(
        description="ID of the department associated with the job"
    )
    department_phone: Optional[str] = Field(
        description="Phone number of the department"
    )
    department_name: Optional[str] = Field(description="Name of the department")
    department_contact_person: Optional[str] = Field(
        description="Contact person of the department"
    )
    department_tax_id: Optional[str] = Field(description="Tax ID of the department")
    department_city: Optional[str] = Field(
        description="City where the department is located"
    )
    department_district: Optional[str] = Field(
        description="District where the department is located"
    )
    department_address: Optional[str] = Field(description="Address of the department")
    wage: int = Field(description="Wage per hour in NTD", ge=0)
    vacancies: int = Field(description="Number of job vacancies", ge=0)
    notes: str = Field(description="Additional notes about the job")
    type: str = Field(
        description="Type of the job (e.g., tournament, individual, department)"
    )
    city: str = Field(description="City where the job is located")
    district: str = Field(description="District where the job is located")
    address: str = Field(description="Detailed address of the job location")
    shifts: list[JobShiftSchema] = Field(description="List of job shifts")
    is_saved: Optional[bool] = Field(
        description="Indicates if the job is saved by the user", default=None
    )
    application_status: Optional[JobApplicationStatus] = Field(
        description="Application status of the job for the user", default=None
    )
    created_at: str = Field(description="Timestamp when the job was created")
    updated_at: str = Field(description="Timestamp when the job was last updated")


class IndividualJobSchema(JobSchema):
    service_content: str = Field(description="Content of the service")
    contact_person: str = Field(description="Name of the contact person")
    contact_phone: str = Field(description="Phone number of the contact person")
    contact_email: str = Field(description="Email address of the contact person")


class TournamentJobSchema(JobSchema):
    tournament_name: str = Field(description="Name of the tournament")
    number_of_tournaments: int = Field(description="Number of tournaments", ge=1)
    supplies_arrangement: str = Field(description="Arrangement for supplies")
    supplies_daigou_budget: int | None = Field(
        default=None, description="Daigou budget for supplies", ge=0
    )
    equipment_arrangement: str = Field(description="Arrangement for equipment")
    equipment_rentals: list[str] = Field(
        default_factory=list, description="List of equipments rented"
    )


class DepartmentJobSchema(JobSchema):
    service_content: str = Field(description="Content of the service")
