import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api/v1" })
  .get("/health", () => ({ status: "ok" }));

export type App = typeof app;

export default app;
