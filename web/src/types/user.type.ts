export type UserType = "AthleticTrainer" | "Department";

export const USER_TYPE_ATHLETIC_TRAINER: UserType = "AthleticTrainer";
export const USER_TYPE_DEPARTMENT: UserType = "Department";
export const USER_TYPES = [
  USER_TYPE_ATHLETIC_TRAINER,
  USER_TYPE_DEPARTMENT,
] as const;

interface UserBase {
  account: string;
  password: string;
  phone: string;
  lineId: string;
  type: UserType;
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
  tatsLicense: boolean;
  tatsLicenseNumber: string;
  tatsLicenseValidUntil: Date;
}

export interface Department extends UserBase {
  departmentName: string;
  taxId: string;
  contact: string;
  address: string;
}

export type User = AthleticTrainer | Department;

export type SignUpRequestBody = Omit<User, "createdAt" | "updatedAt">;
