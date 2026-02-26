from mongoengine import (
    BinaryField,
    DateField,
    EmailField,
    EnumField,
    IntField,
    ListField,
    ReferenceField,
    StringField,
)

from src.utils.glossary import EMTLicense, Gender, Role

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

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "account": self.account,
            "role": self.role,
        }


class AthleticTrainer(User):
    phone = StringField(regex=r"^(09|\+8869)[0-9]{8}$", required=True)
    line_id = StringField(regex=r"^[a-z0-9\-_]{2,20}$", required=True)
    chinese_name = StringField(regex=r"^[\u4e00-\u9fa5]{2,50}$", required=True)
    english_name = StringField(regex=r"^[A-Za-z\s]{2,100}$", required=True)
    birthday = DateField(required=True)
    email = EmailField(required=True)
    id_number = StringField(min_length=10, max_length=10, sparse=True)
    post_office_account = StringField(regex=r"^(?:\d{14}|\d{8})$", required=True)
    permanent_address = StringField(max_length=255, required=True)
    correspondence_address = StringField(max_length=255, required=True)
    emt_license = EnumField(EMTLicense)
    emt_license_valid_until = DateField()
    tats_license_number = StringField(max_length=20)
    tats_license_valid_until = DateField()
    saved_jobs = ListField(ReferenceField("Job"))

    def __init__(self, *args, **values):
        values["role"] = Role.ATHLETIC_TRAINER
        super().__init__(*args, **values)

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "phone": self.phone,
            "line_id": self.line_id,
            "chinese_name": self.chinese_name,
            "english_name": self.english_name,
            "birthday": self.birthday,
            "email": self.email,
            "id_number": self.id_number,
            "post_office_account": self.post_office_account,
            "permanent_address": self.permanent_address,
            "correspondence_address": self.correspondence_address,
            "emt_license": self.emt_license,
            "emt_license_valid_until": (
                self.emt_license_valid_until if self.emt_license_valid_until else None
            ),
            "tats_license_number": self.tats_license_number,
            "tats_license_valid_until": (
                self.tats_license_valid_until if self.tats_license_valid_until else None
            ),
        }


class Department(User):
    phone = StringField(regex=r"^(09|\+8869)[0-9]{8}$", required=True)
    line_id = StringField(regex=r"^[a-z0-9\-_]{2,20}$", required=True)
    name = StringField(max_length=100, required=True)
    contact_person = StringField(max_length=50, required=True)
    tax_id = StringField(regex=r"^\d{8}$", required=True)
    city = StringField(max_length=50, required=True)  # TODO: change to EnumField
    district = StringField(max_length=50, required=True)  # TODO: change to EnumField
    address = StringField(max_length=255, required=True)

    def __init__(self, *args, **values):
        values["role"] = Role.DEPARTMENT
        super().__init__(*args, **values)

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "phone": self.phone,
            "line_id": self.line_id,
            "name": self.name,
            "contact_person": self.contact_person,
            "tax_id": self.tax_id,
            "city": self.city,
            "district": self.district,
            "address": self.address,
        }


class Client(User):
    birthday = DateField(required=True)
    name = StringField(max_length=100, required=True)
    gender = EnumField(Gender, required=True)
    height = IntField(required=True)
    weight = IntField(required=True)

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "birthday": self.birthday,
            "name": self.name,
            "gender": self.gender,
            "height": self.height,
            "weight": self.weight,
        }
