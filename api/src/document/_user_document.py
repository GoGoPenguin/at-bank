from mongoengine import BinaryField, DateField, EmailField, EnumField, StringField
from src.utils.glossary import EMTLicense, Role

from ._base_document import Base


class User(Base):
    meta = {
        "collection": "user",
        "indexes": [("account", "deleted_at")],
        "allow_inheritance": True,
    }

    account = StringField(max_length=50, required=True, unique_with="deleted_at")
    password = BinaryField(required=True)
    role = EnumField(Role, required=True)
    phone = StringField(
        regex=r"^(09|\+8869)[0-9]{8}$", required=True, unique_with="deleted_at"
    )
    line_id = StringField(regex=r"^[a-z0-9\-_]{2,20}$", unique_with="deleted_at")


class AthleticTrainer(User):
    chinese_name = StringField(regex=r"^[\u4e00-\u9fa5]{2,50}$", required=True)
    english_name = StringField(regex=r"^[A-Za-z\s]{2,100}$", required=True)
    birthday = DateField(required=True)
    email = EmailField(unique_with="deleted_at", required=True)
    id_number = StringField(
        min_length=10,
        max_length=10,
        unique_with="deleted_at",
        required=True,
    )
    post_office_account = StringField(
        regex=r"^(?:\d{14}|\d{8})$",
        unique_with="deleted_at",
        required=True,
    )
    permanent_address = StringField(max_length=255, required=True)
    correspondence_address = StringField(max_length=255, required=True)
    emt_license = EnumField(EMTLicense)
    emt_license_valid_until = DateField()
    tats_license = StringField(max_length=20)
    tats_license_valid_until = DateField()

    def __init__(self, *args, **values):
        values["role"] = Role.ATHLETIC_TRAINER
        super().__init__(*args, **values)


class Department(User):
    name = StringField(max_length=100, required=True)
    contact_person = StringField(max_length=50, required=True)
    tax_id = StringField(regex=r"^\d{8}$", unique_with="deleted_at", required=True)
    city = StringField(max_length=50, required=True)  # TODO: change to EnumField
    district = StringField(max_length=50, required=True)  # TODO: change to EnumField
    address = StringField(max_length=255, required=True)

    def __init__(self, *args, **values):
        values["role"] = Role.DEPARTMENT
        super().__init__(*args, **values)
        super().__init__(*args, **values)
