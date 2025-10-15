from typing import Annotated, List, Literal, Optional, Union

from pydantic import BaseModel, Field

from src.utils.glossary import (
    Cities,
    EquipmentArrangement,
    JobType,
    ServiceContent,
    SuppliesArrangement,
)

from ._equipment_schema import EquipmentSchema
from ._job_shit_schema import JobShiftSchema


class CreateJobSchema(BaseModel):
    title: str = Field(description="Job title")
    wage: int = Field(description="Wage per hour in NTD", ge=0)
    vacancies: int = Field(description="Number of job vacancies", ge=0)
    notes: str = Field(description="Additional notes about the job")
    shifts: list[JobShiftSchema] = Field(description="List of job shifts")


class CreateTournamentJobSchema(CreateJobSchema):
    type: Literal[JobType.TOURNAMENT] = Field(
        description="Job type must be 'tournament'"
    )
    city: Cities = Field(description="City where the job is located")
    district: str = Field(description="District where the job is located")
    address: str = Field(description="Detailed address of the job location")
    tournament_name: str = Field(description="Name of the tournament")
    number_of_tournaments: int = Field(description="Number of tournaments", ge=1)
    supplies_arrangement: SuppliesArrangement = Field(
        description="Arrangement for supplies"
    )
    supplies_daigou_budget: Optional[int] = Field(
        description="Daigou budget for supplies", ge=0
    )
    equipment_arrangement: EquipmentArrangement = Field(
        description="Arrangement for equipment"
    )
    equipment_rentals: List[EquipmentSchema] = Field(
        description="List of equipments want to rent", default_factory=list
    )


class CreateIndividualJobSchema(CreateJobSchema):
    type: Literal[JobType.INDIVIDUAL] = Field(
        description="Job type must be 'individual'"
    )
    service_content: ServiceContent = Field(description="Content of the service")
    contact_person: str = Field(description="Name of the contact person")
    contact_phone: str = Field(description="Phone number of the contact person")
    contact_email: str = Field(description="Email address of the contact person")
    city: Cities = Field(description="City where the job is located")
    district: str = Field(description="District where the job is located")
    address: str = Field(description="Detailed address of the job location")


class CreateDepartmentJobSchema(CreateJobSchema):
    type: Literal[JobType.DEPARTMENT] = Field(
        description="Job type must be 'department'"
    )
    service_content: ServiceContent = Field(description="Content of the service")


CreateJobRequestSchema = Annotated[
    Union[
        CreateTournamentJobSchema,
        CreateIndividualJobSchema,
        CreateDepartmentJobSchema,
    ],
    Field(discriminator="type", description="Type of the job"),
]
