from pydantic import BaseModel, SecretStr


class DatabaseConfig(BaseModel):
    host: str
    port: int
    user: str
    password: SecretStr
    database: str
    options: str
