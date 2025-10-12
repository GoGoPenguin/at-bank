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
