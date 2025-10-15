from mongoengine import DateTimeField, EmbeddedDocument, IntField


class JobShift(EmbeddedDocument):
    """
    Represents a shift for a job, embedded within another document.
    Attributes:
        date (DateTimeField): The date of the job shift. Required.
        start_time (IntField): The start time of the shift in seconds since midnight (0-86399). Required.
        end_time (IntField): The end time of the shift in seconds since midnight (0-86399). Required.
    """

    date = DateTimeField(required=True)
    start_time = IntField(min_value=0, max_value=86399, required=True)
    end_time = IntField(min_value=0, max_value=86399, required=True)
