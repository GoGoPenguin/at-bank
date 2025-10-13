from dependency_injector.wiring import Provide
from fastapi import Request, status
from fastapi.responses import ORJSONResponse

from src.service import AuthService
from src.utils.glossary import SameSite, Token


class RefreshTokenHandler:
    service: AuthService = Provide["auth_service"]
    jwt_ttl: int = Provide["config.jwt.ttl"]
    cookies_path: str = Provide["config.cookies.path"]
    cookies_domain: str = Provide["config.cookies.domain"]
    cookies_secure: bool = Provide["config.cookies.secure"]
    cookies_http_only: bool = Provide["config.cookies.http_only"]
    cookies_samesite: SameSite = Provide["config.cookies.samesite"]

    def handle(self, request: Request):
        new_access_token = self.service.refresh(
            request.cookies.get(Token.REFRESH_TOKEN.value, "")
        )
        if not new_access_token:
            return {"error": "Invalid refresh token"}, 401

        response = ORJSONResponse(
            content={},
            status_code=status.HTTP_200_OK,
        )
        response.set_cookie(
            key=Token.ACCESS_TOKEN.value,
            value=new_access_token,
            max_age=self.jwt_ttl,
            path=self.cookies_path,
            domain=self.cookies_domain,
            secure=self.cookies_secure,
            httponly=self.cookies_http_only,
            samesite=self.cookies_samesite.value,
        )
        return response
