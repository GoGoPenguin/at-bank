import type { SignInRequestBody, SignInResponseBody } from "../types/auth.type";
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

  return {
    signIn,
    signUp,
    signOut,
    getMe,
  };
};

export default useApi;
