from typing import Callable, cast

from fastapi import Request
from fastapi.exception_handlers import RequestValidationError
from fastapi.responses import ORJSONResponse
from firebase_functions import https_fn
from jwt import PyJWTError
from mongoengine import NotUniqueError

from src.errors import (
    ConflictError,
    Error,
    InternalServerError,
    UnauthorizedError,
    ValidationError,
)


def firebase_error_handler(request: https_fn.Request) -> Callable:
    def decorator(func: Callable) -> Callable:
        headers = {
            "Content-Type": "application/problem+json",
            # HACK: Allowing all origins as we cannot determine the correct origin here
            #       without risking CORS issues.
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }

        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Error as e:
                e.instance = request.url
                return https_fn.Response(
                    content_type="application/problem+json",
                    response=e.model_dump(),
                    status=e.status,
                    headers=headers,
                )
            except PyJWTError:
                err = UnauthorizedError()
                return https_fn.Response(
                    content_type="application/problem+json",
                    response=err.model_dump(),
                    status=err.status,
                    headers=headers,
                )
            except NotUniqueError:
                err = ConflictError(instance=request.url)
                return https_fn.Response(
                    content_type="application/problem+json",
                    response=err.model_dump(),
                    status=err.status,
                    headers=headers,
                )
            except RequestValidationError as ex:
                err = ValidationError(instance=request.url, errors=ex)
                return https_fn.Response(
                    content_type="application/problem+json",
                    response=err.model_dump(),
                    status=err.status,
                    headers=headers,
                )
            except Exception as ex:
                err = InternalServerError(instance=request.url, detail=str(ex))
                return https_fn.Response(
                    content_type="application/problem+json",
                    response=err.model_dump(),
                    status=err.status,
                    headers=headers,
                )

        return wrapper

    return decorator


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
