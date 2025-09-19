export type EmtLicense = "EMT-1" | "EMT-2" | "EMT-P";

export const EMT_LICENSE_EMT_1: EmtLicense = "EMT-1";
export const EMT_LICENSE_EMT_2: EmtLicense = "EMT-2";
export const EMT_LICENSE_EMT_P: EmtLicense = "EMT-P";

export const EMT_LICENSES = [
  EMT_LICENSE_EMT_1,
  EMT_LICENSE_EMT_2,
  EMT_LICENSE_EMT_P,
] as const;
