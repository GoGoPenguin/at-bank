from pydantic import BaseModel, Field


class JobShiftSchema(BaseModel):
    date: str = Field(description="Date of the job shift in YYYY-MM-DD format")
    start_time: int = Field(
        ge=0,
        le=86399,
        description="The start time of the shift in seconds since midnight (0-86399)",
    )
    end_time: int = Field(
        ge=0,
        le=86399,
        description="The end time of the shift in seconds since midnight (0-86399)",
    )
