from typing import Literal


class PingHandler:
    def handle(self) -> Literal["pong"]:
        return "pong"
