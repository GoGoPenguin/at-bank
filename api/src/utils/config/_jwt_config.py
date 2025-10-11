from typing import Optional

from pydantic import BaseModel


class JWTConfig(BaseModel):
    secret: str
    issuer: str
    audience: Optional[str]
    ttl: int
    refresh_ttl: int
