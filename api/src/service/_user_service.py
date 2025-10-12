from typing import Optional, cast

from src.document import User


class UserService:
    def get_user_by_account(self, account: str) -> Optional[User]:
        return cast(Optional[User], User.objects(account=account).first())
