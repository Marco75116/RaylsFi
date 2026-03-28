import { treaty } from "@elysiajs/eden";
import type { App } from "@/server/api";

export const api = treaty<App>(
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    : window.location.origin
);
