from typing import List

from dependency_injector.wiring import Provide
from fastapi import Request, Response
from jwt import PyJWTError
from pydantic import validate_call
from starlette.authentication import SimpleUser
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from src.errors import UnauthorizedError
from src.utils.glossary import Token
from src.utils.jwt import JWT


class JWTMiddleware(BaseHTTPMiddleware):
    jwt: JWT = Provide["jwt"]

    @property
    def allow_list(self) -> List[str]:
        return [
            "/api/ping",
            "/api/auth/sign-in",
            "/api/auth/sign-up",
            "/api/auth/refresh",
        ]

    @validate_call
    def _is_refresh_token(self, path: str) -> bool:
        return path == "/api/auth/refresh-token"

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        path = request.url.path
        if path.startswith("/api") and path not in self.allow_list:
            try:
                access_token = request.cookies.get(Token.ACCESS_TOKEN.value)
                refresh_token = request.cookies.get(Token.REFRESH_TOKEN.value)

                if not self._is_refresh_token(path):
                    if not access_token:
                        raise KeyError("Missing access token")
                    request.state.access_token = self.jwt.decode(access_token)

                if not refresh_token:
                    raise KeyError("Missing refresh token")

                request.state.refresh_token = self.jwt.decode(refresh_token)
                request.scope["user"] = SimpleUser(request.state.refresh_token.account)
            except KeyError:
                raise UnauthorizedError(
                    detail="Authentication credentials were not provided."
                )
            except PyJWTError:
                raise UnauthorizedError()
        return await call_next(request)
