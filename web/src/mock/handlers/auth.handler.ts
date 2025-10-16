import { serialize } from "cookie";
import { http, HttpResponse } from "msw";
import type {
  SignInRequestBody,
  SignInResponseBody,
} from "../../types/auth.type";
import { type SignUpRequestBody, type User } from "../../types/user.type";
import mockUsers from "../db/user.db.ts";

const authHandlers = [
  http.post<never, SignInRequestBody, SignInResponseBody>(
    `${import.meta.env.VITE_BASE_URL}/api/sign-in`,
    async ({ request }) => {
      const body = await request.json();
      const user = mockUsers.find(
        (user) =>
          user.account === body.account && user.password === body.password
      );
      if (!user) {
        return HttpResponse.json(
          { error: "invalidAccountOrPassword" },
          { status: 400 }
        );
      }

      const hostname = new URL(import.meta.env.VITE_BASE_URL).hostname;
      return new HttpResponse(null, {
        headers: {
          "set-cookie": `${serialize("accessToken", user.account, {
            domain: hostname,
            maxAge: 5 * 60, // 5 minutes
          })},${serialize("refreshToken", user.account, {
            domain: hostname,
            maxAge: body.rememberMe ? 34560000 : undefined, // 400 days or session cookie
          })}`,
        },
      });
    }
  ),
  http.post(
    `${import.meta.env.VITE_BASE_URL}/api/refresh-token`,
    async ({ cookies }) => {
      const user = mockUsers.find(
        (user) => user.account === cookies.refreshToken
      );

      if (!user) {
        return HttpResponse.json(
          { error: "invalidRefreshToken" },
          { status: 401 }
        );
      }
      const hostname = new URL(import.meta.env.VITE_BASE_URL).hostname;
      return new HttpResponse(null, {
        headers: {
          "set-cookie": serialize("accessToken", user.account, {
            domain: hostname,
            maxAge: 5 * 60, // 5 minutes
          }),
        },
      });
    }
  ),
  http.post<never, SignUpRequestBody, never>(
    `${import.meta.env.VITE_BASE_URL}/api/sign-up`,
    async ({ request }) => {
      const body = await request.json();
      const userExists = mockUsers.some(
        (user) => user.account === body.account
      );
      if (userExists) {
        return HttpResponse.json({ error: "accountExists" }, { status: 400 });
      }

      mockUsers.push({
        ...body,
        createdAt: new Date(),
        updatedAt: null,
      } as User);
      return HttpResponse.json({}, { status: 200 });
    }
  ),
  http.delete<never, never, never>(
    `${import.meta.env.VITE_BASE_URL}/api/sign-out`,
    async () => {
      return new HttpResponse(null, {
        headers: {
          "set-cookie": `${serialize("accessToken", "", {
            expires: new Date(0),
          })},${serialize("refreshToken", "", {
            expires: new Date(0),
          })}`,
        },
      });
    }
  ),
] as const;

export default authHandlers;
