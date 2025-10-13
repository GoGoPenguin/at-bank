from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class JWTClaim(BaseModel):
    """
    JSON Web Token Claims model.
    https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims

    Attributes:
        iss (str): Issuer of the JWT.
        sub (Optional[str]): Subject of the JWT (the user).
        aud (Optional[str]): Recipient for which the JWT is intended.
        exp (Optional[datetime]): Time after which the JWT expires.
        nbf (Optional[datetime]): Time before which the JWT is not valid.
        iat (datetime): Time at which the JWT was issued (defaults to now).
        jti (str): Unique identifier for the JWT.
        scope (str): Scope of the JWT.
        account (str): User account.
    """

    iss: str = Field(description="Issuer of the JWT")
    sub: Optional[str] = Field(description="Subject of the JWT (the user)")
    aud: Optional[str] = Field(description="Recipient for which the JWT is intended")
    exp: Optional[datetime] = Field(description="Time after which the JWT expires")
    nbf: Optional[datetime] = Field(
        description="Time before which the JWT is not valid"
    )
    iat: datetime = Field(
        description="Time at which the JWT was issued (defaults to now)"
    )
    jti: str = Field(description="Unique identifier for the JWT")
    scope: str = Field(description="Scope of the JWT")
    account: str = Field(description="User account")
