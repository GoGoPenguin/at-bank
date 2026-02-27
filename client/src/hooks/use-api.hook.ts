import type { SignInRequestBody, SignInResponseBody } from "../types/auth.type";
import type {
  CreateMetricsRequestBody,
  GetMetricsResponseBody,
} from "../types/metrics.type";
import type { SignUpRequestBody, User } from "../types/user.type";
import useAxios from "./use-axios.hook";

const useApi = () => {
  const axios = useAxios();

  const signIn = async (
    req: SignInRequestBody,
  ): Promise<SignInResponseBody> => {
    const response = await axios.post<SignInResponseBody>(
      "/api/auth/sign-in",
      req,
    );
    return response.data;
  };
  const signUp = async (req: SignUpRequestBody): Promise<void> => {
    await axios.post("/api/auth/sign-up", req);
  };
  const signOut = async (): Promise<void> => {
    await axios.delete("/api/auth/sign-out");
  };
  const getMe = async (): Promise<User> => {
    const response = await axios.get("/api/user");
    return response.data;
  };
  const createMetrics = async (
    req: CreateMetricsRequestBody,
  ): Promise<void> => {
    await axios.post("/api/client/metrics", req);
  };
  const getMetrics = async (): Promise<GetMetricsResponseBody> => {
    const response = await axios.get<GetMetricsResponseBody>(
      "/api/client/metrics",
    );
    return response.data;
  };

  return {
    signIn,
    signUp,
    signOut,
    getMe,
    createMetrics,
    getMetrics,
  };
};

export default useApi;
