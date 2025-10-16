from typing import cast

from fastapi import Request
from fastapi.exception_handlers import RequestValidationError
from fastapi.responses import ORJSONResponse
from jwt import PyJWTError
from mongoengine import NotUniqueError

from src.errors import Error, InternalServerError, UnauthorizedError, ValidationError
from src.errors._errors import ConflictError


async def error_handler(request: Request, ex: Exception):
    headers = {
        "Content-Type": "application/problem+json",
        # HACK: Allowing all origins as we cannot determine the correct origin here
        #       without risking CORS issues.
        "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
        "Access-Control-Allow-Credentials": "true",
    }
    match ex:
        case Error():
            err = cast(Error, ex)
            err.instance = request.url.path
            return ORJSONResponse(
                headers=headers,
                content=err.model_dump(),
                status_code=err.status,
            )
        case PyJWTError():
            err = UnauthorizedError()
            return ORJSONResponse(
                headers=headers,
                content=err.model_dump(),
                status_code=err.status,
            )
        case NotUniqueError():
            err = ConflictError(instance=request.url.path)
            return ORJSONResponse(
                headers=headers,
                content=err.model_dump(),
                status_code=err.status,
            )
        case RequestValidationError():
            err = ValidationError(instance=request.url.path, errors=ex)
            return ORJSONResponse(
                headers=headers,
                content=err.model_dump(),
                status_code=err.status,
            )
        case _:
            err = InternalServerError(instance=request.url.path, detail=str(ex))
            return ORJSONResponse(
                headers=headers,
                content=err.model_dump(),
                status_code=err.status,
            )
