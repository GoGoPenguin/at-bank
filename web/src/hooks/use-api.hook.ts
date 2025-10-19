import type { SignInRequestBody, SignInResponseBody } from "../types/auth.type";
import type { Equipment } from "../types/equipment.type";
import {
  JOB_TYPE_TOURNAMENT,
  type CreateJobRequest,
  type GetJobResponse,
  type GetJobsRequestParams,
  type GetJobsResponse,
} from "../types/job.type";
import type { SignUpRequestBody, User } from "../types/user.type";
import useAxios from "./use-axios.hook";

const useApi = () => {
  const axios = useAxios();

  const signIn = async (
    req: SignInRequestBody
  ): Promise<SignInResponseBody> => {
    const response = await axios.post<SignInResponseBody>(
      "/api/auth/sign-in",
      req
    );
    return response.data;
  };
  const signUp = async (req: SignUpRequestBody): Promise<void> => {
    await axios.post("/api/auth/sign-up", req);
  };
  const signOut = async (): Promise<void> => {
    await axios.delete("/api/auth/sign-out");
  };
  const checkAccountExists = async (account: string): Promise<boolean> => {
    const response = await axios.head(`/api/user/${account}`);
    return response.status === 200;
  };
  const getMe = async (): Promise<User> => {
    const response = await axios.get("/api/user");
    return response.data;
  };
  const getJobs = async (
    req: GetJobsRequestParams
  ): Promise<GetJobsResponse> => {
    const response = await axios.get("/api/jobs", { params: req });
    return response.data;
  };
  const getJob = async (id: string): Promise<GetJobResponse> => {
    const response = await axios.get(`/api/jobs/${id}`);
    return response.data;
  };
  const saveJob = async (id: string): Promise<void> => {
    await axios.patch(`/api/jobs/${id}/save`);
  };
  const unsaveJob = async (id: string): Promise<void> => {
    await axios.patch(`/api/jobs/${id}/unsave`);
  };
  const createJob = async (data: CreateJobRequest): Promise<void> => {
    data.shifts = data.shifts.map((shift) => ({
      ...shift,
      startTime:
        typeof shift.startTime === "number"
          ? shift.startTime
          : shift.startTime.getHours() * 3600 +
            shift.startTime.getMinutes() * 60,
      endTime:
        typeof shift.endTime === "number"
          ? shift.endTime
          : shift.endTime.getHours() * 3600 + shift.endTime.getMinutes() * 60,
    }));
    if (data.type === JOB_TYPE_TOURNAMENT) {
      data.city = data.tournamentCity;
      data.district = data.tournamentDistrict;
      data.address = data.tournamentAddress;
      delete data.tournamentCity;
      delete data.tournamentDistrict;
      delete data.tournamentAddress;
    }
    await axios.post(`/api/jobs`, data);
  };
  const applyToJob = async (id: string, shifts: string[]): Promise<void> => {
    await axios.post(`/api/jobs/apply`, { jobId: id, availableSlots: shifts });
  };
  const getEquipments = async (): Promise<Equipment[]> => {
    const response = await axios.get("/api/equipments");
    return response.data;
  };

  return {
    signIn,
    signUp,
    signOut,
    checkAccountExists,
    getMe,
    getJobs,
    getJob,
    saveJob,
    unsaveJob,
    createJob,
    applyToJob,
    getEquipments,
  };
};

export default useApi;
