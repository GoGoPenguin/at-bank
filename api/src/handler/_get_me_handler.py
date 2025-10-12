from typing import Optional

from dependency_injector.wiring import Provide
from fastapi import Request
from src.document import AthleticTrainer, Department
from src.schema import AthleticTrainerSchema, DepartmentSchema, UserSchema
from src.service import UserService

from ._base_handler import BaseHandler


class GetMeHandler(BaseHandler):
    user_service: UserService = Provide["user_service"]

    def handle(
        self,
        request: Request,
    ) -> Optional[UserSchema | AthleticTrainerSchema | DepartmentSchema]:
        user = self.user_service.get_user_by_account(request.state.access_token.account)
        if not user:
            return None
        if isinstance(user, AthleticTrainer):
            return AthleticTrainerSchema.model_validate(user.to_dict())
        if isinstance(user, Department):
            return DepartmentSchema.model_validate(user.to_dict())
        return UserSchema.model_validate(user.to_dict())
