from dependency_injector.wiring import Provide
from src.schema import CheckAccountResponseSchema
from src.service import UserService


class CheckAccountHandler:
    service: UserService = Provide["user_service"]

    def handle(self, account: str) -> CheckAccountResponseSchema:
        user = self.service.get_user_by_account(account)

        return CheckAccountResponseSchema(
            exists=user is not None,
        )
