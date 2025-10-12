from dependency_injector.wiring import Provide
from src.schema import CheckAccountResponseSchema
from src.service import UserService

from ._base_handler import BaseHandler


class CheckAccountHandler(BaseHandler):
    service: UserService = Provide["user_service"]

    def handle(self, account: str):
        user = self.service.get_user_by_account(account)

        return self.respond(
            data=CheckAccountResponseSchema(
                exists=user is not None,
            ).model_dump(),
        )
