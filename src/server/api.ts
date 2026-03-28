import { Elysia, t } from "elysia";
import { createStripeCardholder } from "@/lib/stripe-helpers";

const app = new Elysia({ prefix: "/api/v1" })
  .get("/health", () => ({ status: "ok" }))
  .post(
    "/cardholders",
    async ({ body }) => {
      const cardholder = await createStripeCardholder({
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber ?? undefined,
        billing: body.billing ?? undefined,
      });
      return {
        id: cardholder.id,
        name: cardholder.name,
        email: cardholder.email,
        status: cardholder.status,
      };
    },
    {
      body: t.Object({
        name: t.Union([t.String(), t.Null()]),
        email: t.String(),
        phoneNumber: t.Optional(t.String()),
        billing: t.Optional(
          t.Object({
            line1: t.String(),
            city: t.String(),
            postalCode: t.String(),
            country: t.String(),
          }),
        ),
      }),
    },
  );

export type App = typeof app;

export default app;
