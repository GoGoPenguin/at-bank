from mongoengine import IntField, StringField

from ._base_document import Base


class Equipment(Base):
    name = StringField(max_length=100, required=True, unique=True)
    price_per_day = IntField(min_value=0, required=True)
    notes = StringField()

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "price_per_day": self.price_per_day,
            "notes": self.notes,
        }
