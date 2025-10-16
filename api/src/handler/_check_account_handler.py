from dependency_injector.wiring import Provide
from fastapi import status
from fastapi.responses import Response

from src.service import UserService


class CheckAccountHandler:
    service: UserService = Provide["user_service"]

    def handle(self, account: str) -> Response:
        user = self.service.get_user_by_account(account)

        return Response(
            status_code=status.HTTP_200_OK if user else status.HTTP_404_NOT_FOUND
        )
