from typing import Optional

from fastapi import Request

from src.document import AthleticTrainer, Department
from src.document._user_document import Client
from src.schema import AthleticTrainerSchema, DepartmentSchema, UserSchema
from src.schema._user_schema import ClientSchema


class GetMeHandler:
    def handle(
        self,
        request: Request,
    ) -> Optional[UserSchema | AthleticTrainerSchema | DepartmentSchema | ClientSchema]:
        if isinstance(request.state.user, AthleticTrainer):
            return AthleticTrainerSchema.model_validate(request.state.user.to_dict())
        if isinstance(request.state.user, Department):
            return DepartmentSchema.model_validate(request.state.user.to_dict())
        if isinstance(request.state.user, Client):
            return ClientSchema.model_validate(request.state.user.to_dict())
        return UserSchema.model_validate(request.state.user.to_dict())
