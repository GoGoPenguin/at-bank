import datetime
from typing import Self, cast

from loguru import logger
from mongoengine import (
    DateTimeField,
    Document,
    ObjectIdField,
    QuerySet,
    queryset_manager,
)
from pymongo import monitoring
from pymongo.monitoring import (
    CommandFailedEvent,
    CommandListener,
    CommandStartedEvent,
    CommandSucceededEvent,
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
    def objects(cls, queryset: QuerySet):
        """
        Returns a queryset of objects that have not been deleted.

        This manager filters the queryset to include only documents where
        the 'deleted_at' field is set to the minimum datetime value, indicating
        that the document has not been marked as deleted.

        Args:
            cls: The document class being queried.
            queryset (QuerySet): The initial queryset to filter.

        Returns:
            QuerySet: A queryset containing only non-deleted documents.
        """
        return queryset.filter(deleted_at=datetime.datetime.min)


class CommandLogger(CommandListener):
    def started(self, event: CommandStartedEvent):
        logger.trace(event)

    def succeeded(self, event: CommandSucceededEvent):
        logger.trace(event)

    def failed(self, event: CommandFailedEvent):
        logger.trace(event)


monitoring.register(CommandLogger())
