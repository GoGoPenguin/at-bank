from datetime import datetime
from typing import List, cast

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

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "job": cast(Job, self.job).to_dict() if self.job else None,
            "applicant": (
                cast(AthleticTrainer, self.applicant).to_dict()
                if self.applicant
                else None
            ),
            "status": self.status,
            "available_slots": [
                cast(datetime, slot.date).isoformat() if slot else None
                for slot in cast(List[AvailabilitySlot], self.available_slots)
            ],
        }
