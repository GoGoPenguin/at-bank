from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from src.utils.glossary import Role


class UserSchema(BaseModel):
    id: str = Field(description="User ID")
    account: str = Field(description="User account")
    role: Role = Field(description="User role")
    phone: str = Field(description="User phone number")
    line_id: str = Field(description="User Line ID")


class AthleticTrainerSchema(UserSchema):
    chinese_name: str = Field(description="Chinese name of the athletic trainer")
    english_name: str = Field(description="English name of the athletic trainer")
    birthday: datetime = Field(description="Birthday of the athletic trainer")
    email: EmailStr = Field(description="Email of the athletic trainer")
    id_number: str = Field(description="ID number of the athletic trainer")
    post_office_account: str = Field(
        description="Post office account of the athletic trainer"
    )
    permanent_address: str = Field(
        description="Permanent address of the athletic trainer"
    )
    correspondence_address: str = Field(
        description="Correspondence address of the athletic trainer"
    )
    emt_license: Optional[str] = Field(
        description="EMT license of the athletic trainer"
    )
    emt_license_valid_until: Optional[datetime] = Field(
        description="EMT license valid until date"
    )
    tats_license_number: Optional[str] = Field(
        description="TATS license of the athletic trainer"
    )
    tats_license_valid_until: Optional[datetime] = Field(
        description="TATS license valid until date"
    )


class DepartmentSchema(UserSchema):
    name: str = Field(description="Name of the department")
    contact_person: str = Field(description="Contact person of the department")
    tax_id: str = Field(description="Tax ID of the department")
    city: str = Field(description="City of the department")
    district: str = Field(description="District of the department")
    address: str = Field(description="Address of the department")
