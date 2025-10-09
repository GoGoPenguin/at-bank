from dependency_injector import containers, providers
from src.utils.config import Config


class Container(containers.DeclarativeContainer):
    config = providers.Configuration()
    config.from_pydantic(Config())  # type: ignore
