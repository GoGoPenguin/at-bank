from pydantic_settings import BaseSettings, SettingsConfigDict

from ._app_config import AppConfig
from ._cookies_config import CookiesConfig
from ._db_config import DatabaseConfig
from ._jwt_config import JWTConfig


class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_nested_delimiter="__",
        extra="ignore",
    )

    app: AppConfig
    db: DatabaseConfig
    jwt: JWTConfig
    cookies: CookiesConfig
