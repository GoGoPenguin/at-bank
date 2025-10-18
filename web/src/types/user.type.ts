export type Role = "athletic_trainer" | "department";

export const ROLE_ATHLETIC_TRAINER: Role = "athletic_trainer";
export const ROLE_DEPARTMENT: Role = "department";
export const ROLES = [ROLE_ATHLETIC_TRAINER, ROLE_DEPARTMENT] as const;

interface UserBase {
  account: string;
  password: string;
  phone: string;
  lineId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface AthleticTrainer extends UserBase {
  chineseName: string;
  englishName: string;
  birthday: Date;
  id: string;
  email: string;
  postOfficeAccount: string;
  permanentAddress: string;
  correspondenceAddress: string;
  emtLicense: string;
  emtLicenseValidUntil: Date;
  tatsLicense: boolean; // Deprecated: check tatsLicenseNumber instead
  tatsLicenseNumber: string;
  tatsLicenseValidUntil: Date;
}

export interface Department extends UserBase {
  name: string;
  taxId: string;
  contactPerson: string;
  city: string;
  district: string;
  address: string;
}

export type User = AthleticTrainer | Department;

export type SignUpRequestBody = Omit<User, "createdAt" | "updatedAt">;
