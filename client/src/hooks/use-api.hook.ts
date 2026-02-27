import type { SignInRequestBody, SignInResponseBody } from "../types/auth.type";
import type { SignUpRequestBody } from "../types/user.type";
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

  return {
    signIn,
    signUp,
    signOut,
  };
};

export default useApi;
