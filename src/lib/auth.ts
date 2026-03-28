import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const resend = new Resend(process.env.AUTH_RESEND_KEY);
        await resend.emails.send({
          from: "login@raylsfi.com",
          to: email,
          subject: "Sign in to RaylsFi",
          html: `<a href="${url}">Click here to sign in to RaylsFi</a>`,
        });
      },
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    storeSessionInDatabase: true,
  },
});

export type Session = typeof auth.$Infer.Session;
