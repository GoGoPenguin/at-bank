import asyncio

import firebase_admin
import uvicorn
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from firebase_admin import firestore
from firebase_functions import https_fn, options

from src.container import Container
from src.handler import error_handler
from src.middleware import AccessLogMiddleware, JWTMiddleware
from src.router import router
from src.utils.logger import init_logging

options.set_global_options(region="asia-east1")

if not firebase_admin._apps:
    firebase_admin.initialize_app()
    firestore.client()

init_logging()

container = Container()
container.wire(
    modules=[
        ".handler",
        ".middleware",
        ".service",
    ],
    from_package="src",
)
container.init_resources()

app = FastAPI()
app.container = container  # type: ignore
app.add_exception_handler(Exception, error_handler)
app.add_exception_handler(RequestValidationError, error_handler)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(JWTMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=container.config.cors.allow_origins().split(","),
    allow_methods=container.config.cors.allow_methods().split(","),
    allow_headers=container.config.cors.allow_headers().split(","),
    allow_credentials=True,
)
app.add_middleware(AccessLogMiddleware)

app.include_router(router, prefix="/api")


# This is your HTTP function that Firebase will call
@https_fn.on_request()
def handler(req: https_fn.Request) -> https_fn.Response:
    """
    Bridge a Firebase HTTP request to the FastAPI app (ASGI), including proper cookie and multi-header handling.
    """

    # Build an ASGI scope from the incoming request
    scope = {
        "type": "http",
        "method": req.method,
        "path": req.path,
        "headers": [(k.lower().encode(), v.encode()) for k, v in req.headers.items()],
        "query_string": req.query_string or b"",
    }

    # Create ASGI receive / send coroutines
    async def receive():
        return {
            "type": "http.request",
            "body": req.get_data() or b"",
            "more_body": False,
        }

    response_status = 200
    response_headers = []
    response_body = []

    async def send(message):
        nonlocal response_status, response_headers, response_body
        if message["type"] == "http.response.start":
            response_status = message.get("status", 200)
            response_headers = message.get("headers", [])
        elif message["type"] == "http.response.body":
            body = message.get("body", b"")
            response_body.append(body)

    async def run_app():
        await app(scope, receive, send)

    # Run the ASGI app
    asyncio.run(run_app())

    body = b"".join(response_body)

    # Handle duplicate headers correctly (e.g., multiple Set-Cookie)
    from collections import defaultdict

    header_map = defaultdict(list)
    for k, v in response_headers:
        header_map[k.decode()].append(v.decode())

    # Firebase's https_fn.Response expects a flat dict,
    # so we join multi-value headers with commas (for most cases)
    # but we keep multiple 'set-cookie' headers separate for browser compatibility.
    response = https_fn.Response(
        response=body,
        status=response_status,
        headers={k: ", ".join(vs) for k, vs in header_map.items()},
    )

    # Explicitly handle multiple cookies if present
    if "set-cookie" in header_map:
        for cookie in header_map["set-cookie"]:
            response.headers.add("Set-Cookie", cookie)

    return response


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=container.config.app.host(),
        port=container.config.app.port(),
        reload=container.config.app.reload(),
        reload_dirs=["."],
        timeout_keep_alive=container.config.app.timeout_keep_alive(),
    )
