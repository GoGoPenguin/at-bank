from pydantic import BaseModel, Field


class CheckAccountResponseSchema(BaseModel):
    exists: bool = Field(description="Whether the account exists")
