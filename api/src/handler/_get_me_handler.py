from typing import Optional

from fastapi import Request

from src.document import AthleticTrainer, Department
from src.schema import AthleticTrainerSchema, DepartmentSchema, UserSchema


class GetMeHandler:
    def handle(
        self,
        request: Request,
    ) -> Optional[UserSchema | AthleticTrainerSchema | DepartmentSchema]:
        if isinstance(request.state.user, AthleticTrainer):
            return AthleticTrainerSchema.model_validate(request.state.user.to_dict())
        if isinstance(request.state.user, Department):
            return DepartmentSchema.model_validate(request.state.user.to_dict())
        return UserSchema.model_validate(request.state.user.to_dict())
