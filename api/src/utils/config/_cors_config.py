from pydantic import BaseModel


class CorsConfig(BaseModel):
    allow_origins: str
    allow_methods: str
    allow_headers: str
