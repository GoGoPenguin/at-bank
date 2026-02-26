from mongoengine import DictField, EnumField, IntField, ReferenceField, StringField

from src.utils.glossary import MetricsType

from ._base_document import Base
from ._user_document import User


class Metrics(Base):
    meta = {
        "collection": "metrics",
        "indexes": [("name", "deleted_at")],
    }

    user = ReferenceField(User)
    name = EnumField(MetricsType, required=True)
    value = IntField(required=True)
    unit = StringField()
    notes = StringField()
    metadata = DictField()

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "name": self.name,
            "value": self.value,
            "unit": self.unit,
            "notes": self.notes,
            "metadata": self.metadata,
        }
