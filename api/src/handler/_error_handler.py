from typing import cast

from fastapi import Request
from fastapi.exception_handlers import RequestValidationError
from fastapi.responses import ORJSONResponse
from jose import JWTError
from src.errors import Error, InternalServerError, UnauthorizedError, ValidationError


async def error_handler(request: Request, ex: Exception):
    match ex:
        case Error():
            err = cast(Error, ex)
            err.instance = request.url.path
            return ORJSONResponse(
                headers={
                    "Content-Type": "application/problem+json",
                },
                content=err.model_dump(),
                status_code=err.status,
            )
        case JWTError():
            err = UnauthorizedError()
            return ORJSONResponse(
                headers={
                    "Content-Type": "application/problem+json",
                },
                content=err.model_dump(),
                status_code=err.status,
            )
        case RequestValidationError():
            err = ValidationError(instance=request.url.path, errors=ex)
            return ORJSONResponse(
                headers={
                    "Content-Type": "application/problem+json",
                },
                content=err.model_dump(),
                status_code=err.status,
            )
        case _:
            err = InternalServerError(instance=request.url.path, detail=str(ex))
            return ORJSONResponse(
                headers={
                    "Content-Type": "application/problem+json",
                },
                content=err.model_dump(),
                status_code=err.status,
            )
