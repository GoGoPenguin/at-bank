from dependency_injector.wiring import Provide
from fastapi import status
from fastapi.responses import ORJSONResponse
from src.service import AuthService
from src.utils.glossary import Token


class SignOutHandler:
    service: AuthService = Provide["auth_service"]

    def handle(self) -> ORJSONResponse:
        response = ORJSONResponse(
            content={},
            status_code=status.HTTP_200_OK,
        )
        response.delete_cookie(key=Token.ACCESS_TOKEN)
        response.delete_cookie(key=Token.REFRESH_TOKEN)
        return response
        return response
