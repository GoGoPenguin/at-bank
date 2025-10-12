import asyncio

import firebase_admin
import uvicorn
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.gzip import GZipMiddleware
from firebase_admin import firestore
from firebase_functions import https_fn, options
from src.container import Container
from src.handler import error_handler
from src.middleware import JWTMiddleware
from src.router import router

options.set_global_options(region="asia-east1")

if not firebase_admin._apps:
    firebase_admin.initialize_app()
    firestore.client()

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

app.include_router(router, prefix="/api")


# This is your HTTP function that Firebase will call
@https_fn.on_request()
def handler(req: https_fn.Request) -> https_fn.Response:
    """
    Bridge a Firebase HTTP request to the FastAPI app (ASGI).
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
    # Convert headers to dict
    headers_dict = {k.decode(): v.decode() for (k, v) in response_headers}

    return https_fn.Response(
        response=body,
        status=response_status,
        headers=headers_dict,
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=container.config.app.host(),
        port=container.config.app.port(),
        reload=container.config.app.reload(),
        reload_dirs=["."],
        timeout_keep_alive=container.config.app.timeout_keep_alive(),
    )
