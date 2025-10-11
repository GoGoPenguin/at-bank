from typing import Optional

from pydantic import BaseModel
from src.utils.glossary import SameSite


class CookiesConfig(BaseModel):
    path: str
    domain: Optional[str]
    secure: bool
    http_only: bool
    samesite: SameSite
