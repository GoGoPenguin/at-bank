from datetime import date
from typing import List, Optional, Tuple, cast

from src.document import (
    Application,
    AthleticTrainer,
    AvailabilitySlot,
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
    def get_jobs(
        self, user: User, params: GetJobsRequestSchema
    ) -> Tuple[List[Job], Tuple[int, int]]:
        skipping = (params.page - 1) * params.size
        pipeline = []

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
                        },
                    },
                    {
                        "$lookup": {
                            "from": "application",
                            "let": {"job_id": "$_id"},
                            "pipeline": [
                                {
                                    "$match": {
                                        "$expr": {
                                            "$and": [
                                                {"$eq": ["$job", "$$job_id"]},
                                                {"$eq": ["$applicant", user.id]},
                                            ]
                                        }
                                    }
                                },
                                {"$project": {"status": 1}},
                            ],
                            "as": "application_status",
                        }
                    },
                    {
                        "$addFields": {
                            "is_saved": {"$gt": [{"$size": "$saved_by_user"}, 0]},
                            "application_status": {
                                "$cond": {
                                    "if": {
                                        "$gt": [{"$size": "$application_status"}, 0]
                                    },
                                    "then": {
                                        "$arrayElemAt": [
                                            "$application_status.status",
                                            0,
                                        ]
                                    },
                                    "else": None,
                                }
                            },
                        }
                    },
                    {"$project": {"saved_by_user": 0}},
                ]
            )
        rows = list(Job.objects().aggregate(pipeline))
        total_items = len(rows)
        total_pages = (total_items + params.size - 1) // params.size
        rows = rows[skipping : skipping + params.size]
        return [
            (
                job := Job._from_son(row),
                setattr(job, "is_saved", cast(dict, row).get("is_saved")),
                setattr(
                    job, "application_status", cast(dict, row).get("application_status")
                ),
            )[0]
            if isinstance(user, AthleticTrainer)
            else Job._from_son(row)
            for row in rows
        ], (total_items, total_pages)

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
            job = TournamentJob(**params.model_dump())
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
