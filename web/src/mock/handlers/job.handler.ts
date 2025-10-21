import { http, HttpResponse } from "msw";
import type { Job, JobType } from "../../types/job.type";
import mockJobs from "../db/job.db";

const jobHandlers = [
  http.get(
    `${import.meta.env.VITE_BASE_URL}/api/jobs`,
    async ({ cookies, request }) => {
      const user = cookies.accessToken;
      if (!user) {
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
      }

      const url = new URL(request.url);
      const getParam = (name: string, fallback: unknown = null) =>
        url.searchParams.get(name) ?? fallback;
      const paginate = <T>(data: T[], page: number, limit: number) =>
        data.slice((page - 1) * limit, page * limit);
      const filterByJobType = (data: Job[], type: JobType | null) =>
        type ? data.filter((datum) => datum.type === type) : data;
      const filterByLocation = (data: Job[], location: string | null) =>
        location ? data.filter((datum) => datum.city === location) : data;

      const type = getParam("type", null) as JobType | null;
      const page = Number(getParam("page", 1));
      const limit = Number(getParam("limit", 10));
      const location = getParam("location", null) as string | null;
      const jobs = filterByLocation(filterByJobType(mockJobs, type), location);
      return HttpResponse.json({
        data: paginate(jobs, page, limit),
        totalItems: jobs.length,
        totalPages: Math.ceil(jobs.length / limit),
      });
    }
  ),
  http.get(
    `${import.meta.env.VITE_BASE_URL}/api/jobs/:id`,
    async ({ cookies, params }) => {
      const user = cookies.accessToken;
      if (!user) {
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
      }

      const job = mockJobs.find((j) => j.id === params.id);
      if (!job) {
        return HttpResponse.json({ error: "not found" }, { status: 404 });
      }
      return HttpResponse.json(job);
    }
  ),
] as const;

export default jobHandlers;
