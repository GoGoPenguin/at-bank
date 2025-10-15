from typing import List, cast

from loguru import logger

from src.document import (
    AthleticTrainer,
    Department,
    DepartmentJob,
    IndividualJob,
    Job,
    TournamentJob,
    User,
)
from src.errors import ConflictError, NotFoundError
from src.schema import CreateJobRequestSchema, GetJobsRequestSchema
from src.utils.glossary import JobType


class JobService:
    def get_jobs(self, user: User, params: GetJobsRequestSchema) -> List[Job]:
        skipping = (params.page - 1) * params.size
        pipeline = [
            {"$sort": {"created_at": -1}},  # Or any other sort order
            {"$skip": skipping},
            {"$limit": params.size},
        ]

        if params.city:
            pipeline.insert(0, {"$match": {"city": params.city}})
        if params.job_type:
            pipeline.insert(0, {"$match": {"type": params.job_type}})

        if isinstance(user, Department):
            pipeline.insert(0, {"$match": {"created_by": user.id}})
        elif isinstance(user, AthleticTrainer):
            pipeline.extend(
                [
                    {
                        "$lookup": {
                            "from": "user",
                            "let": {"job_id": "$_id"},
                            "pipeline": [
                                {
                                    "$match": {
                                        "$expr": {
                                            "$and": [
                                                {"$eq": ["$_id", user.id]},
                                                {
                                                    "$in": [
                                                        "$$job_id",
                                                        {
                                                            "$ifNull": [
                                                                "$saved_jobs",
                                                                [],
                                                            ]
                                                        },
                                                    ]
                                                },
                                            ]
                                        }
                                    }
                                }
                            ],
                            "as": "saved_by_user",
                        }
                    },
                    {
                        "$addFields": {
                            "is_saved": {"$gt": [{"$size": "$saved_by_user"}, 0]}
                        }
                    },
                    {"$project": {"saved_by_user": 0}},
                ]
            )
        rows = list(Job.objects().aggregate(pipeline))
        logger.debug(f"Aggregated job rows: {rows}")
        return [
            (
                job := Job._from_son(row),
                setattr(job, "is_saved", cast(dict, row).get("is_saved")),
            )[0]
            if isinstance(user, AthleticTrainer) and "is_saved" in row
            else Job._from_son(row)
            for row in rows
        ]

    def get_job(self, id: str) -> Job:
        job = Job.objects(id=id).first()
        if job is None:
            raise NotFoundError(detail="Job not found.")
        return cast(Job, job)

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

    def apply_to_job(self, user: AthleticTrainer, job_id: str) -> None: ...

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
