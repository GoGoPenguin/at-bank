from dependency_injector.wiring import Provide
from src.service import AuthService
from src.utils.glossary import Token

from ._base_handler import BaseHandler


class SignOutHandler(BaseHandler):
    service: AuthService = Provide["auth_service"]

    def handle(self):
        return self.respond(
            delete_cookies=[
                Token.ACCESS_TOKEN,
                Token.REFRESH_TOKEN,
            ]
        )
