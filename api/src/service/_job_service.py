from typing import List, Optional, cast

from mongoengine import QuerySet

from src.document import (
    Department,
    DepartmentJob,
    IndividualJob,
    Job,
    TournamentJob,
    User,
)
from src.schema import CreateJobRequestSchema, GetJobsRequestSchema
from src.utils.glossary import JobStatus, JobType


class JobService:
    def get_jobs(self, user: User, params: GetJobsRequestSchema) -> List[Job]:
        skipping = (params.page - 1) * params.size
        query = cast(QuerySet, Job.objects()[skipping : skipping + params.size])

        if params.city:
            query = query.filter(city=params.city)
        if params.job_type:
            query = query.filter(type=params.job_type)

        if isinstance(user, Department):
            query = query.filter(created_by=user)
        else:
            query = query.filter(status=JobStatus.ACTIVE)

        return cast(List[Job], query.all())

    def get_job(self, id: str) -> Optional[Job]:
        job = Job.objects(id=id).first()
        return cast(Optional[Job], job)

    def create_job(self, user: User, params: CreateJobRequestSchema) -> Job:
        if params.type == JobType.INDIVIDUAL:
            job = IndividualJob(**params.model_dump())
        elif params.type == JobType.DEPARTMENT:
            job = DepartmentJob(**params.model_dump())
        elif params.type == JobType.TOURNAMENT:
            job = TournamentJob(**params.model_dump())
        else:
            raise ValueError("Invalid job type provided.")

        job.created_by = user
        job.save()
        return job

    def apply_to_job(self, job_id, user_id): ...

    def save_job(self, job_id, user_id): ...
