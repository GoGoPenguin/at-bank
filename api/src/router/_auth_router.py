from fastapi import APIRouter

from src import handler
from src.utils.glossary import HttpMethod

router = APIRouter()

router.add_api_route(
    name="Sign In",
    path="/sign-in",
    methods=[HttpMethod.POST],
    endpoint=handler.SignInHandler().handle,
)
router.add_api_route(
    name="Sign Out",
    path="/sign-out",
    methods=[HttpMethod.DELETE],
    endpoint=handler.SignOutHandler().handle,
)
router.add_api_route(
    name="Sign Up",
    path="/sign-up",
    methods=[HttpMethod.POST],
    endpoint=handler.SignUpHandler().handle,
)
router.add_api_route(
    name="Refresh Token",
    path="/refresh-token",
    methods=[HttpMethod.PUT],
    endpoint=handler.RefreshTokenHandler().handle,
)
