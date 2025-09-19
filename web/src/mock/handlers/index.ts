import authHandlers from "./auth.handler";
import jobHandlers from "./job.handler";
import userHandlers from "./user.handler";

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...jobHandlers,
] as const;
