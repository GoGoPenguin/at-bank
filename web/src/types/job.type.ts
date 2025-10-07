import type { Pagination } from "./pagination.type";

export type JobType = "Tournament" | "Individual" | "Department";
export type JobStatus = "Active" | "Paused" | "Closed";
export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";
export type ServiceContent = "Athletic Training" | "Massage Therapy";

export const JOB_TYPE_TOURNAMENT: JobType = "Tournament";
export const JOB_TYPE_INDIVIDUAL: JobType = "Individual";
export const JOB_TYPE_DEPARTMENT: JobType = "Department";

export const JOB_STATUS_ACTIVE: JobStatus = "Active";
export const JOB_STATUS_PAUSED: JobStatus = "Paused";
export const JOB_STATUS_CLOSED: JobStatus = "Closed";

export const APPLICATION_STATUS_PENDING: ApplicationStatus = "Pending";
export const APPLICATION_STATUS_ACCEPTED: ApplicationStatus = "Accepted";
export const APPLICATION_STATUS_REJECTED: ApplicationStatus = "Rejected";

export const SERVICE_CONTENT_ATHLETIC_TRAINING: ServiceContent =
  "Athletic Training";
export const SERVICE_CONTENT_MASSAGE_THERAPY: ServiceContent =
  "Massage Therapy";

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
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  APPLICATION_STATUS_PENDING,
  APPLICATION_STATUS_ACCEPTED,
  APPLICATION_STATUS_REJECTED,
] as const;
export const SERVICE_CONTENTS: ServiceContent[] = [
  SERVICE_CONTENT_ATHLETIC_TRAINING,
  SERVICE_CONTENT_MASSAGE_THERAPY,
] as const;

export interface Job {
  id: number;
  type: JobType;
  title: string;
  company: string;
  date: Date;
  hours: number;
  wage: number;
  vacancies: number;
  location: string;
  address?: string;
  startedAt?: Date;
  notes: string;
  saved: boolean;
  applicationStatus?: ApplicationStatus;
  head?: string;
  contact?: string;
  contactPhone?: string;
  contactEmail?: string;
  taxId?: string;
  companyAddress?: string;
  serviceContent?: ServiceContent;
  tournamentName?: string;
  numberOfTournaments?: number;
  createdAt: Date;
  updatedAt: Date;
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

export type GetJobResponse = Job;
