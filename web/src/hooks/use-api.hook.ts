import type { SignInRequestBody, SignInResponseBody } from "../types/auth.type";
import type {
  GetJobResponse,
  GetJobsRequestParams,
  GetJobsResponse,
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

  return {
    signIn,
    signUp,
    signOut,
    checkAccountExists,
    getMe,
    getJobs,
    getJob,
  };
};

export default useApi;
