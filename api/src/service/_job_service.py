from datetime import date
from typing import List, Optional, Tuple, cast

from src.document import (
    Application,
    AthleticTrainer,
    AvailabilitySlot,
    Department,
    DepartmentJob,
    EquipmentSnapshot,
    IndividualJob,
    Job,
    TournamentJob,
    User,
)
from src.document._equipment_document import Equipment
from src.errors import ConflictError, NotFoundError
from src.schema import CreateJobRequestSchema, GetJobsRequestSchema
from src.utils.glossary import JobStatus, JobType


class JobService:
    def get_jobs(
        self, user: User, params: GetJobsRequestSchema
    ) -> Tuple[List[Job], Tuple[int, int]]:
        query = Job.objects()

        if params.city:
            query = query.filter(city=params.city)
        if params.job_type:
            query = query.filter(type=params.job_type)

        if isinstance(user, Department):
            query = query.filter(created_by=user)
        if isinstance(user, AthleticTrainer):
            query = query.filter(status=JobStatus.ACTIVE)

        all_jobs = list(query.all())
        total_items = len(all_jobs)
        total_pages = (total_items + params.size - 1) // params.size
        start = (params.page - 1) * params.size
        end = start + params.size
        paginated_jobs = all_jobs[start:end]

        if isinstance(user, AthleticTrainer):
            saved_job_ids = {job.id for job in getattr(user, "saved_jobs", [])}

            user_applications = {
                app.job.id: app.status
                for app in Application.objects().filter(applicant=user).all()
            }

            enriched_jobs = []
            for job in paginated_jobs:
                setattr(job, "is_saved", job.id in saved_job_ids)
                setattr(job, "application_status", user_applications.get(job.id))
                enriched_jobs.append(job)
            return enriched_jobs, (total_items, total_pages)

        return paginated_jobs, (total_items, total_pages)

    def get_job(self, id: str, user: Optional[User] = None) -> Job:
        job = Job.objects(id=id).first()
        if job is None:
            raise NotFoundError(detail="Job not found.")
        if isinstance(user, AthleticTrainer):
            setattr(job, "is_saved", job in cast(List[Job], user.saved_jobs))

            application = cast(
                Optional[Application],
                Application.objects(applicant=user, job=job).first(),
            )
            if application is not None:
                setattr(job, "application_status", application.status)

        return cast(Job, job)

    def create_job(self, user: User, params: CreateJobRequestSchema) -> Job:
        if params.type == JobType.INDIVIDUAL:
            job = IndividualJob(**params.model_dump())
        elif params.type == JobType.DEPARTMENT:
            job = DepartmentJob(**params.model_dump())
        elif params.type == JobType.TOURNAMENT:
            equipments = [
                EquipmentSnapshot(**equipment.to_dict())
                for equipment in Equipment.objects(id__in=params.equipment_rentals)
            ]
            data = params.model_dump()
            data["equipment_rentals"] = equipments
            job = TournamentJob(**data)
        else:
            raise ValueError("Invalid job type provided.")

        job.created_by = user
        job.save()
        return job

    def apply_to_job(
        self,
        user: AthleticTrainer,
        job_id: str,
        available_slots: List[date],
    ) -> None:
        job = self.get_job(job_id)

        # TODO: Check if the user has already applied to this job
        # TODO: Check if the job has available vacancies

        application = Application(
            applicant=user,
            job=job,
            available_slots=[AvailabilitySlot(date=slot) for slot in available_slots],
        )
        application.save()

    def save_job(self, user: AthleticTrainer, job_id: str):
        job = self.get_job(job_id)

        if job in cast(List[Job], user.saved_jobs):
            raise ConflictError(detail="Job already saved.")
        else:
            cast(List[Job], user.saved_jobs).append(job)

        user.save()

    def unsave_job(self, user: AthleticTrainer, job_id: str):
        job = self.get_job(job_id)

        if job in cast(List[Job], user.saved_jobs):
            cast(List[Job], user.saved_jobs).remove(job)
        else:
            raise NotFoundError(detail="Job not in saved list.")

        user.save()
        return user

    def update_job_status(self, job_id: str, new_status: JobStatus) -> Job:
        job = self.get_job(job_id)
        job.status = new_status
        job.save()
        return job

    def delete_job(self, job_id: str) -> None:
        job = self.get_job(job_id)
        job.delete()

    def get_applicants(
        self, user: Department, job_id: Optional[str]
    ) -> List[Application]:
        query = Application.objects()
        if job_id:
            job = self.get_job(job_id)
            if job.created_by != user:
                raise NotFoundError(detail="Job not found.")
            query = query.filter(job=job)
        else:
            query = query.filter(job__in=Job.objects(created_by=user))
        return cast(List[Application], query.all())
