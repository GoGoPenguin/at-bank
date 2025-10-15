import time

from fastapi import Request, Response
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint


class AccessLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        start_time = time.time()
        response: Response = await call_next(request)
        process_time = "{0:.2f}".format((time.time() - start_time) * 1000)
        client_ip = request.client.host if request.client else "unknown"

        logger.bind(
            client_ip=client_ip,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            process_time=process_time,
        ).info(
            f"{request.method} {request.url.path} {response.status_code} from {client_ip} "
            f"with {process_time}ms"
        )
        return response
