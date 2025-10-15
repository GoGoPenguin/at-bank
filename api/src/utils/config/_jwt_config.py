from typing import Optional

from pydantic import BaseModel, SecretStr


class JWTConfig(BaseModel):
    secret: SecretStr
    issuer: str
    audience: Optional[str]
    ttl: int
    refresh_ttl: int
