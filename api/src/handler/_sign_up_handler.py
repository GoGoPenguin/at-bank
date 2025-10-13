from dependency_injector.wiring import Provide
from fastapi import status
from fastapi.responses import JSONResponse

from src.schema import SignUpRequestSchema
from src.service import AuthService


class SignUpHandler:
    service: AuthService = Provide["auth_service"]

    def handle(self, params: SignUpRequestSchema):
        self.service.sign_up(params)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={})
