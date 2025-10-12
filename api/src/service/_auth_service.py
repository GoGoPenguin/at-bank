from typing import Tuple, cast

from dependency_injector.wiring import Provide
from src.document import User
from src.errors import InvalidCredentialsError
from src.utils.hasher import check_password, hash_password
from src.utils.jwt import JWT


class AuthService:
    jwt: JWT = Provide["jwt"]
    jwt_ttl: int = Provide["config.jwt.ttl"]
    jwt_refresh_ttl: int = Provide["config.jwt.refresh_ttl"]

    def sign_in(
        self, account: str, password: bytes, remember_me: bool
    ) -> Tuple[str, str]:
        user = cast(User, User.objects(account=account).first())
        if not user:
            raise InvalidCredentialsError()
        if not check_password(password, cast(bytes, user.password)):
            raise InvalidCredentialsError()

        access_token = self.jwt.encode(user=user, ttl=self.jwt_ttl)
        refresh_token = self.jwt.encode(user=user, ttl=self.jwt_refresh_ttl)
        return access_token, refresh_token

    def sign_out(self, token: str) -> None: ...

    def sign_up(self, account: str, password: str, role: str) -> str: ...
