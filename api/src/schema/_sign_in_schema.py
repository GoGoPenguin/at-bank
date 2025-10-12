from pydantic import BaseModel, Field


class SignInRequestSchema(BaseModel):
    account: str = Field(description="User account")
    password: str = Field(description="User password")
    remember_me: bool = Field(default=False, description="Whether to remember the user")
