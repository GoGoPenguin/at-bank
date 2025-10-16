export type JobType = "tournament" | "individual" | "department";
export type JobStatus = "Active" | "Paused" | "Closed";
export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";
export type ServiceContent = "Athletic Training" | "Massage Therapy";
export type SuppliesType = "Reimbursement" | "Self-provided" | "Proxy Purchase";
export type EquipmentType = "Self-provided" | "Rental";

export const JOB_TYPE_TOURNAMENT: JobType = "tournament";
export const JOB_TYPE_INDIVIDUAL: JobType = "individual";
export const JOB_TYPE_DEPARTMENT: JobType = "department";

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

export const SUPPLIES_REIMBURSEMENT: SuppliesType = "Reimbursement";
export const SUPPLIES_SELF_PROVIDED: SuppliesType = "Self-provided";
export const SUPPLIES_PROXY_PURCHASE: SuppliesType = "Proxy Purchase";

export const EQUIPMENT_SELF_PROVIDED: EquipmentType = "Self-provided";
export const EQUIPMENT_RENTAL: EquipmentType = "Rental";

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
export const SUPPLIES_TYPES: SuppliesType[] = [
  SUPPLIES_REIMBURSEMENT,
  SUPPLIES_SELF_PROVIDED,
  SUPPLIES_PROXY_PURCHASE,
] as const;
export const EQUIPMENT_TYPES: EquipmentType[] = [
  EQUIPMENT_SELF_PROVIDED,
  EQUIPMENT_RENTAL,
] as const;

interface Shift {
  date: Date;
  startTime: number;
  endTime: number;
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
  equipmentArrangement: string;
  equipmentRentals: string[];
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
