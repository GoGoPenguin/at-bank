from mongoengine import DateField, EmbeddedDocument


class AvailabilitySlot(EmbeddedDocument):
    """
    AvailabilitySlot represents a user's availability for a specific day.

    Attributes:
        date (DateField): The date for which the user's availability is specified. This field is required.
    """

    date = DateField(required=True)
