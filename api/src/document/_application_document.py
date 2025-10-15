from mongoengine import (
    EmbeddedDocumentListField,
    EnumField,
    ReferenceField,
)

from src.utils.glossary import JobApplicationStatus

from ._availability_slot_document import AvailabilitySlot
from ._base_document import Base
from ._job_document import Job
from ._user_document import AthleticTrainer


class Application(Base):
    job = ReferenceField(Job)
    applicant = ReferenceField(AthleticTrainer)
    status = EnumField(
        JobApplicationStatus,
        required=True,
        default=JobApplicationStatus.PENDING,
    )
    available_slots = EmbeddedDocumentListField(AvailabilitySlot, required=True)
