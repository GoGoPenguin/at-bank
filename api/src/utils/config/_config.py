from pydantic_settings import BaseSettings, SettingsConfigDict

from ._app_config import AppConfig
from ._db_config import DatabaseConfig


class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_nested_delimiter="__",
        extra="ignore",
    )

    app: AppConfig
    db: DatabaseConfig
