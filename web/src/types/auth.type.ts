import { type ErrorResponseBody } from "./error.type";

export interface SignInRequestBody {
  account: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignInResponseBody extends ErrorResponseBody {
  accessToken?: string;
  refreshToken?: string;
}
