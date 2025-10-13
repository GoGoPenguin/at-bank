from dependency_injector.wiring import Provide
from fastapi import status
from fastapi.responses import ORJSONResponse
from src.schema import SignInRequestSchema
from src.service import AuthService
from src.utils.glossary import SameSite, Token


class SignInHandler:
    service: AuthService = Provide["auth_service"]
    jwt_ttl: int = Provide["config.jwt.ttl"]
    jwt_refresh_ttl: int = Provide["config.jwt.refresh_ttl"]
    cookies_path: str = Provide["config.cookies.path"]
    cookies_domain: str = Provide["config.cookies.domain"]
    cookies_secure: bool = Provide["config.cookies.secure"]
    cookies_http_only: bool = Provide["config.cookies.http_only"]
    cookies_samesite: SameSite = Provide["config.cookies.samesite"]

    def handle(self, params: SignInRequestSchema) -> ORJSONResponse:
        access_token, refresh_token = self.service.sign_in(
            account=params.account,
            password=params.password.encode(),
            remember_me=params.remember_me,
        )

        response = ORJSONResponse(
            content={},
            status_code=status.HTTP_200_OK,
        )
        response.set_cookie(
            key=Token.ACCESS_TOKEN,
            value=access_token,
            max_age=self.jwt_ttl,
            path=self.cookies_path,
            domain=self.cookies_domain,
            secure=self.cookies_secure,
            httponly=self.cookies_http_only,
            samesite=self.cookies_samesite.value,
        )
        response.set_cookie(
            key=Token.REFRESH_TOKEN,
            value=refresh_token,
            max_age=self.jwt_refresh_ttl if params.remember_me else None,
            path=self.cookies_path,
            domain=self.cookies_domain,
            secure=self.cookies_secure,
            httponly=self.cookies_http_only,
            samesite=self.cookies_samesite.value,
        )
        return response
