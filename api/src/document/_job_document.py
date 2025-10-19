from datetime import datetime, timezone
from typing import List, cast

from mongoengine import (
    NULLIFY,
    BooleanField,
    EmailField,
    EmbeddedDocumentListField,
    EnumField,
    IntField,
    ListField,
    ReferenceField,
    StringField,
)

from src.utils.glossary import (
    JobApplicationStatus,
    JobStatus,
    JobType,
    ServiceContent,
    SuppliesArrangement,
)

from ._base_document import Base
from ._equipment_document import Equipment
from ._job_shift_document import JobShift
from ._user_document import Department


class Job(Base):
    meta = {
        "collection": "job",
        "indexes": [
            ("type", "deleted_at"),
            ("status", "deleted_at"),
            ("wage", "deleted_at"),
            ("type", "status", "deleted_at"),
        ],
        "allow_inheritance": True,
    }

    type = EnumField(JobType, required=True)
    status = EnumField(JobStatus, required=True, default=JobStatus.ACTIVE)
    title = StringField(max_length=100, required=True)
    wage = IntField(min_value=0, required=True)
    vacancies = IntField(min_value=1, required=True)
    notes = StringField()
    shifts = EmbeddedDocumentListField(JobShift, required=True)
    is_saved = BooleanField(default=None, null=True)
    application_status = EnumField(JobApplicationStatus, default=None, null=True)
    created_by = ReferenceField(Department, required=True, reverse_delete_rule=NULLIFY)

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "type": self.type,
            "status": self.status,
            "title": self.title,
            "department_id": str(cast(Department, self.created_by).id),
            "department_phone": cast(Department, self.created_by).phone,
            "department_name": cast(Department, self.created_by).name,
            "department_contact_person": cast(
                Department, self.created_by
            ).contact_person,
            "department_tax_id": cast(Department, self.created_by).tax_id,
            "department_city": cast(Department, self.created_by).city,
            "department_district": cast(Department, self.created_by).district,
            "department_address": cast(Department, self.created_by).address,
            "wage": self.wage,
            "vacancies": self.vacancies,
            "notes": self.notes,
            "shifts": [
                {
                    "date": cast(datetime, shift.date)
                    .replace(tzinfo=timezone.utc)
                    .isoformat(),
                    "start_time": shift.start_time,
                    "end_time": shift.end_time,
                }
                for shift in cast(List[JobShift], self.shifts)
            ],
            "is_saved": self.is_saved,
            "application_status": self.application_status,
        }


class TournamentJob(Job):
    meta = {
        "indexes": [
            ("city", "deleted_at"),
            ("type", "city", "deleted_at"),
            ("status", "type", "city", "deleted_at"),
        ],
    }

    city = StringField(max_length=50)
    district = StringField(max_length=50)
    address = StringField(max_length=255)
    tournament_name = StringField(max_length=100)
    number_of_tournaments = IntField(min_value=1)
    supplies_arrangement = EnumField(SuppliesArrangement)
    supplies_daigou_budget = IntField(min_value=0)
    equipment_rentals = ListField(ReferenceField(Equipment))

    def __init__(self, *args, **values):
        values["type"] = JobType.TOURNAMENT
        super().__init__(*args, **values)

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "city": self.city,
            "district": self.district,
            "address": self.address,
            "tournament_name": self.tournament_name,
            "number_of_tournaments": self.number_of_tournaments,
            "supplies_arrangement": self.supplies_arrangement,
            "supplies_daigou_budget": self.supplies_daigou_budget,
            "equipment_rentals": [
                {
                    "id": str(equipment.id),
                    "name": equipment.name,
                    "price_per_day": equipment.price_per_day,
                    "notes": equipment.notes,
                }
                for equipment in cast(List[Equipment], self.equipment_rentals)
            ],
        }


class IndividualJob(Job):
    meta = {
        "indexes": [
            ("city", "deleted_at"),
            ("type", "city", "deleted_at"),
            ("status", "type", "city", "deleted_at"),
        ],
    }

    service_content = EnumField(ServiceContent)
    contact_person = StringField(max_length=100)
    contact_phone = StringField(regex=r"^(09|\+8869)[0-9]{8}$")
    contact_email = EmailField(required=True)
    city = StringField(max_length=50)
    district = StringField(max_length=50)
    address = StringField(max_length=255)

    def __init__(self, *args, **values):
        values["type"] = JobType.INDIVIDUAL
        super().__init__(*args, **values)

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "service_content": self.service_content,
            "contact_person": self.contact_person,
            "contact_phone": self.contact_phone,
            "contact_email": self.contact_email,
            "city": self.city,
            "district": self.district,
            "address": self.address,
        }


class DepartmentJob(Job):
    service_content = EnumField(ServiceContent)

    def __init__(self, *args, **values):
        values["type"] = JobType.DEPARTMENT
        super().__init__(*args, **values)

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
            "service_content": self.service_content,
            "city": cast(Department, self.created_by).city,
            "district": cast(Department, self.created_by).district,
            "address": cast(Department, self.created_by).address,
        }
