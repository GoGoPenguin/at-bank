from dependency_injector.wiring import Provide
from src.schema import Cookies, SignInSchema
from src.service import AuthService
from src.utils.glossary import Token

from ._base_handler import BaseHandler


class SignInHandler(BaseHandler):
    service: AuthService = Provide["auth_service"]
    jwt_ttl: int = Provide["config.jwt.ttl"]
    jwt_refresh_ttl: int = Provide["config.jwt.refresh_ttl"]

    def handle(self, params: SignInSchema):
        access_token, refresh_token = self.service.sign_in(
            account=params.account,
            password=params.password.encode(),
            remember_me=params.remember_me,
        )

        return self.respond(
            cookies=[
                Cookies(
                    key=Token.ACCESS_TOKEN,
                    value=access_token,
                    max_age=self.jwt_ttl,
                ),
                Cookies(
                    key=Token.REFRESH_TOKEN,
                    value=refresh_token,
                    max_age=self.jwt_refresh_ttl if params.remember_me else None,
                ),
            ]
        )
