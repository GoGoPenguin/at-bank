from typing import Optional

from pydantic import BaseModel, Field


class EquipmentSchema(BaseModel):
    id: Optional[str] = Field(description="Unique identifier for the equipment")
    name: str = Field(description="Name of the equipment")
    price_per_day: int = Field(
        description="Price per day for renting the equipment", ge=0
    )
    notes: Optional[str] = Field(
        default=None, description="Additional notes about the equipment"
    )
