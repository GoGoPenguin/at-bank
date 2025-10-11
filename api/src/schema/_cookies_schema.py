from typing import Optional

from pydantic import BaseModel


class Cookies(BaseModel):
    key: str
    value: str
    max_age: Optional[int] = None
    expires: Optional[int] = None
