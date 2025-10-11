from dependency_injector import containers, providers
from mongoengine import connect
from src.service import AuthService
from src.utils.config import Config
from src.utils.jwt import JWT


class Container(containers.DeclarativeContainer):
    config = providers.Configuration()
    config.from_pydantic(Config())  # type: ignore

    db = providers.Resource(
        connect,
        host="mongodb://{user}:{password}@{host}:{port}/{database}?{options}".format(
            user=config.db.user(),
            password=config.db.password().get_secret_value(),
            host=config.db.host(),
            port=config.db.port(),
            database=config.db.database(),
            options=config.db.options(),
        ),
    )

    jwt = providers.Singleton(
        JWT,
        key=config.jwt.secret(),
        issuer=config.jwt.issuer(),
        audience=config.jwt.audience(),
    )

    auth_service = providers.Singleton(AuthService)
