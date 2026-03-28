import { Elysia, t } from "elysia";
import { createStripeCardholder, createStripeCard } from "@/lib/stripe-helpers";

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
  )
  .post(
    "/cards",
    async ({ body }) => {
      const card = await createStripeCard({
        cardholderId: body.cardholderId,
        currency: body.currency ?? undefined,
        type: body.type ?? undefined,
        status: body.status ?? undefined,
      });
      return {
        id: card.id,
        cardholderId: card.cardholder.id,
        currency: card.currency,
        type: card.type,
        status: card.status,
        last4: card.last4,
      };
    },
    {
      body: t.Object({
        cardholderId: t.String(),
        currency: t.Optional(t.String()),
        type: t.Optional(
          t.Union([t.Literal("virtual"), t.Literal("physical")]),
        ),
        status: t.Optional(
          t.Union([t.Literal("active"), t.Literal("inactive")]),
        ),
      }),
    },
  );

export type App = typeof app;

export default app;
