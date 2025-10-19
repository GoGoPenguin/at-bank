import type { Equipment } from "./equipment.type";

export type JobType = "tournament" | "individual" | "department";
export type JobStatus = "active" | "paused" | "closed";
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type ServiceContent = "athletic_training" | "massage_therapy";
export type SuppliesArrangement = "reimbursement" | "self_provided" | "daigou";

export const JOB_TYPE_TOURNAMENT: JobType = "tournament";
export const JOB_TYPE_INDIVIDUAL: JobType = "individual";
export const JOB_TYPE_DEPARTMENT: JobType = "department";

export const JOB_STATUS_ACTIVE: JobStatus = "active";
export const JOB_STATUS_PAUSED: JobStatus = "paused";
export const JOB_STATUS_CLOSED: JobStatus = "closed";

export const APPLICATION_STATUS_PENDING: ApplicationStatus = "pending";
export const APPLICATION_STATUS_ACCEPTED: ApplicationStatus = "accepted";
export const APPLICATION_STATUS_REJECTED: ApplicationStatus = "rejected";

export const SERVICE_CONTENT_ATHLETIC_TRAINING: ServiceContent =
  "athletic_training";
export const SERVICE_CONTENT_MASSAGE_THERAPY: ServiceContent =
  "massage_therapy";

export const SUPPLIES_REIMBURSEMENT: SuppliesArrangement = "reimbursement";
export const SUPPLIES_SELF_PROVIDED: SuppliesArrangement = "self_provided";
export const SUPPLIES_DAIGOU: SuppliesArrangement = "daigou";

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
export const SUPPLIES_ARRANGEMENTS: SuppliesArrangement[] = [
  SUPPLIES_REIMBURSEMENT,
  SUPPLIES_SELF_PROVIDED,
  SUPPLIES_DAIGOU,
] as const;

interface Shift {
  date: Date;
  startTime: Date | number;
  endTime: Date | number;
}

export interface Job {
  id: string;
  title: string;
  type: JobType;
  departmentId: string;
  departmentPhone: string;
  departmentName: string;
  departmentContactPerson: string;
  departmentTaxId: string;
  departmentCity: string;
  departmentDistrict: string;
  departmentAddress: string;
  shifts: Shift[];
  wage: number;
  vacancies: number;
  city: string;
  district: string;
  address: string;
  startedAt?: Date;
  notes: string;
  isSaved: boolean;
  status?: JobStatus;
  applicationStatus?: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndividualJob extends Job {
  type: "individual";
  serviceContent: ServiceContent;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
}

export interface TournamentJob extends Job {
  type: "tournament";
  tournamentName: string;
  numberOfTournaments: number;
  suppliesArrangement: string;
  suppliesDaigouBudget: number;
  equipmentRentals: Equipment[];
}

export interface DepartmentJob extends Job {
  type: "department";
  serviceContent: ServiceContent;
}

export interface GetJobsRequestParams {
  jobType?: JobType;
  city?: string;
  page?: number;
  size?: number;
}

export interface GetJobsResponse {
  data: Job[];
  totalItems: number;
  totalPages: number;
}

export type GetJobResponse = Job;

export interface CreateJobRequest {
  type: JobType;
  title: string;
  notes: string;
  wage: number;
  vacancies: number;
  shifts: Shift[];
  contactPerson?: string;
  contactPersonBirthday?: Date;
  contactPhone?: string;
  contactEmail?: string;
  city?: string;
  district?: string;
  address?: string;
  serviceContents?: string[];
  tournamentName?: string;
  numberOfTournaments?: number;
  tournamentCity?: string;
  tournamentDistrict?: string;
  tournamentAddress?: string;
  suppliesArrangement?: SuppliesArrangement;
  suppliesDaigouBudget?: number;
  equipmentRentals?: string[];
}
