from typing import Any, List

from dependency_injector.wiring import Provide
from fastapi import status
from fastapi.responses import ORJSONResponse
from src.schema import Cookies
from src.utils.glossary import SameSite


class BaseHandler:
    cookies_path: str = Provide["config.cookies.path"]
    cookies_domain: str = Provide["config.cookies.domain"]
    cookies_secure: bool = Provide["config.cookies.secure"]
    cookies_http_only: bool = Provide["config.cookies.http_only"]
    cookies_samesite: SameSite = Provide["config.cookies.samesite"]

    def handle(self, *args: Any, **kwds: Any):
        raise NotImplementedError

    def respond(
        self,
        data: Any = {},
        cookies: List[Cookies] = [],
        delete_cookies: List[str] = [],
    ) -> ORJSONResponse:
        response = ORJSONResponse(
            content=data,
            status_code=status.HTTP_200_OK,
        )

        for cookie in cookies:
            response.set_cookie(
                key=cookie.key,
                value=cookie.value,
                max_age=cookie.max_age,
                expires=cookie.expires,
                path=self.cookies_path,
                domain=self.cookies_domain,
                secure=self.cookies_secure,
                httponly=self.cookies_http_only,
                samesite=self.cookies_samesite.value,
            )

        for key in delete_cookies:
            response.delete_cookie(key=key)

        return response
