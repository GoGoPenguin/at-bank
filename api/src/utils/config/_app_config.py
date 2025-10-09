from pydantic import BaseModel


class AppConfig(BaseModel):
    host: str
    port: int
    reload: bool
    timeout_keep_alive: int
