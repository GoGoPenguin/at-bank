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


class JobType(str, Enum):
    TOURNAMENT = "tournament"
    INDIVIDUAL = "individual"
    DEPARTMENT = "department"


class JobStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    CLOSED = "closed"


class JobApplicationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class SuppliesArrangement(str, Enum):
    REIMBURSEMENT = "reimbursement"
    SELF_PROVIDED = "self_provided"
    DAIGOU = "daigou"


class EquipmentArrangement(str, Enum):
    RENTAL = "rental"
    SELF_PROVIDED = "self_provided"


class ServiceContent(str, Enum):
    ATHLETIC_TRAINING = "athletic_training"
    MASSAGE_THERAPY = "massage_therapy"


class Cities(str, Enum):
    TAIPEI_CITY = "taipei-city"
    KEELUNG_CITY = "keelung-city"
    NEW_TAIPEI = "new-taipei"
    TAOYUAN_CITY = "taoyuan-city"
    HSINCHU_CITY = "hsinchu-city"
    HSINCHU_COUNTY = "hsinchu-county"
    MIAOLI_COUNTY = "miaoli-county"
    TAICHUNG_CITY = "taichung-city"
    CHANGHUA_COUNTY = "changhua-county"
    NANTOU_COUNTY = "nantou-county"
    YUNLIN_COUNTY = "yunlin-county"
    CHIAYI_CITY = "chiayi-city"
    CHIAYI_COUNTY = "chiayi-county"
    TAINAN_CITY = "tainan-city"
    KAOHSIUNG_CITY = "kaohsiung-city"
    PINGTUNG_COUNTY = "pingtung-county"
    TAITUNG_COUNTY = "taitung-county"
    HUALIEN_COUNTY = "hualien-county"
    YILAN_COUNTY = "yilan-county"
    PENGHU_COUNTY = "penghu-county"
    KINMEN_COUNTY = "kinmen-county"
    LIENCHIANG_COUNTY = "lienchiang-county"
