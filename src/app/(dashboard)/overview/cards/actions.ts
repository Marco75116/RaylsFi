"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { createStripeCard } from "@/lib/stripe-helpers";

export async function createCard(type: "virtual" | "physical") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  const user = await db
    .select({ stripeCardholderId: schema.user.stripeCardholderId })
    .from(schema.user)
    .where(eq(schema.user.id, session.user.id))
    .then((rows) => rows[0]);

  if (!user?.stripeCardholderId) {
    throw new Error("No Stripe cardholder found for this user");
  }

  const card = await createStripeCard({
    cardholderId: user.stripeCardholderId,
    type,
  });

  return {
    id: card.id,
    type: card.type,
    last4: card.last4,
    status: card.status,
  };
}
