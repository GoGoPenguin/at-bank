export type Role = "client";
export type Gender = "male" | "female" | "other";

export const ROLE_CLIENT: Role = "client";
export const ROLES = [ROLE_CLIENT] as const;

interface User {
  account: string;
  password: string;
  name: string;
  email: string;
  gender: Gender;
  birthday: Date;
  height: number;
  weight: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date | null;
}

export type SignUpRequestBody = Omit<User, "createdAt" | "updatedAt">;
