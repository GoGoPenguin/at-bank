from enum import Enum


class HttpMethod(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"


class Role(str, Enum):
    ATHLETIC_TRAINER = "athletic_trainer"
    DEPARTMENT = "department"


class EMTLicense(str, Enum):
    EMT_1 = "EMT-1"
    EMT_2 = "EMT-2"
    EMT_P = "EMT-P"


class SameSite(str, Enum):
    STRICT = "strict"
    LAX = "lax"
    NONE = "none"


class Token(str, Enum):
    ACCESS_TOKEN = "access_token"
    REFRESH_TOKEN = "refresh_token"
