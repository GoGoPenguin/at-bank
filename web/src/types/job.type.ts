import type { Pagination } from "./pagination.type";

export type JobType = "Tournament" | "Individual" | "Department";
export type JobStatus = "Active" | "Paused" | "Closed";

export const JOB_TYPE_TOURNAMENT: JobType = "Tournament";
export const JOB_TYPE_INDIVIDUAL: JobType = "Individual";
export const JOB_TYPE_DEPARTMENT: JobType = "Department";

export const JOB_STATUS_ACTIVE: JobStatus = "Active";
export const JOB_STATUS_PAUSED: JobStatus = "Paused";
export const JOB_STATUS_CLOSED: JobStatus = "Closed";

export const JOB_STATUSES: JobStatus[] = [
  JOB_STATUS_ACTIVE,
  JOB_STATUS_PAUSED,
  JOB_STATUS_CLOSED,
] as const;
export const JOB_TYPES: JobType[] = [
  JOB_TYPE_TOURNAMENT,
  JOB_TYPE_INDIVIDUAL,
  JOB_TYPE_DEPARTMENT,
] as const;

export interface Job {
  type: JobType;
  title: string;
  company: string;
  date: Date;
  hours: number;
  wage: number;
  vacancies: number;
  location: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndividualJob extends Job {
  title: string;
  description: string;
  location: string;
  company: string;
}

export interface DepartmentJob extends Job {
  department: string;
  head: string;
}

export interface TournamentJob extends Job {
  title: string;
  description: string;
  location: string;
  company: string;
  prize: number;
}

export interface GetJobsRequestParams {
  type?: JobType;
  location?: string;
  page?: number;
  limit?: number;
}

export interface GetJobsResponse {
  data: Job[];
  pagination: Pagination;
}
