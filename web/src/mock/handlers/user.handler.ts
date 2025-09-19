import { http, HttpResponse } from "msw";
import mockUsers from "../db/user.db.ts";

const userHandlers = [
  http.head<{ account: string }>(
    `${import.meta.env.VITE_BASE_URL}/api/user/:account`,
    ({ params }) => {
      const user = mockUsers.find((user) => user.account === params.account);
      if (user) {
        return HttpResponse.json(null, { status: 200 });
      }
      return HttpResponse.json(null, { status: 404 });
    }
  ),
  http.get(`${import.meta.env.VITE_BASE_URL}/api/user`, async ({ cookies }) => {
    const user = mockUsers.find((user) => user.account === cookies.accessToken);
    if (!user) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return HttpResponse.json(user);
  }),
] as const;

export default userHandlers;
