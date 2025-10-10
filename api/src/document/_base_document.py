import datetime
from typing import Self, cast

from mongoengine import (
    DateTimeField,
    Document,
    ObjectIdField,
    QuerySet,
    queryset_manager,
)


def queryset(func):
    return cast(QuerySet, func)


class Base(Document):
    meta = {
        "abstract": True,
        "allow_inheritance": True,
        "indexes": ["created_at", "deleted_at"],
    }

    # HACK: These would be injected by mongoengine, Pylance cannot infer it.
    # So we add this here to suppress the warning.
    id: ObjectIdField

    created_at = DateTimeField(
        required=True,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )
    updated_at = DateTimeField(default=datetime.datetime.min)
    deleted_at = DateTimeField(default=datetime.datetime.min)

    def delete(self, *args, **kwargs):
        self.deleted_at = datetime.datetime.now(datetime.timezone.utc)
        self.save(*args, **kwargs)

    def update(self, *args, **kwargs) -> Self:
        self.updated_at = datetime.datetime.now(datetime.timezone.utc)
        return super().update(*args, **kwargs)

    @queryset
    @queryset_manager
    def objects(doc_cls, queryset: QuerySet):
        return queryset.filter(deleted_at=datetime.datetime.min)
