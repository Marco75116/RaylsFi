"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [magicLinkClient()],
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        throw new Error(
          retryAfter
            ? `Too many requests. Please try again in ${retryAfter} seconds.`
            : "Too many requests. Please try again later.",
        );
      }
    },
  },
});

export const { signIn, signOut, useSession } = authClient;
