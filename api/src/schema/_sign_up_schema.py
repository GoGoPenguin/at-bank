from datetime import datetime
from typing import Annotated, Literal, Optional, Union

from pydantic import BaseModel, EmailStr, Field

from src.utils.glossary import Role


class SignUpAthleticTrainerSchema(BaseModel):
    account: str = Field(description="User account")
    password: bytes = Field(description="User password")
    role: Literal[Role.ATHLETIC_TRAINER] = Field(description="User role")
    phone: str = Field(
        description="User phone number", pattern=r"^(09|\+8869)[0-9]{8}$"
    )
    line_id: str = Field(description="User Line ID", pattern=r"^[a-z0-9\-_]{2,20}$")
    chinese_name: str = Field(
        description="Chinese name of the athletic trainer",
        pattern=r"^[\u4e00-\u9fa5]{2,50}$",
    )
    english_name: str = Field(
        description="English name of the athletic trainer",
        pattern=r"^[A-Za-z\s]{2,100}$",
    )
    birthday: datetime = Field(description="Birthday of the athletic trainer")
    email: EmailStr = Field(description="Email of the athletic trainer")
    id_number: str = Field(
        description="ID number of the athletic trainer", max_length=10, min_length=10
    )
    post_office_account: str = Field(
        description="Post office account of the athletic trainer",
        pattern=r"^(?:\d{14}|\d{8})$",
    )
    permanent_address: str = Field(
        description="Permanent address of the athletic trainer", max_length=255
    )
    correspondence_address: str = Field(
        description="Correspondence address of the athletic trainer", max_length=255
    )
    emt_license: Optional[str] = Field(
        description="EMT license of the athletic trainer", default=None
    )
    emt_license_valid_until: Optional[datetime] = Field(
        description="EMT license valid until date", default=None
    )
    tats_license_number: Optional[str] = Field(
        description="TATS license of the athletic trainer", default=None
    )
    tats_license_valid_until: Optional[datetime] = Field(
        description="TATS license valid until date", default=None
    )


class SignUpDepartmentSchema(BaseModel):
    account: str = Field(description="User account")
    password: bytes = Field(description="User password")
    role: Literal[Role.DEPARTMENT] = Field(description="User role")
    phone: str = Field(
        description="User phone number", pattern=r"^(09|\+8869)[0-9]{8}$"
    )
    line_id: str = Field(description="User Line ID", pattern=r"^[a-z0-9\-_]{2,20}$")
    name: str = Field(description="Name of the department", max_length=100)
    contact_person: str = Field(
        description="Contact person of the department", max_length=50
    )
    tax_id: str = Field(description="Tax ID of the department", pattern=r"^\d{8}$")
    city: str = Field(description="City of the department", max_length=50)
    district: str = Field(description="District of the department", max_length=50)
    address: str = Field(description="Address of the department", max_length=255)


SignUpRequestSchema = Annotated[
    Union[SignUpAthleticTrainerSchema, SignUpDepartmentSchema],
    Field(discriminator="role"),
]
