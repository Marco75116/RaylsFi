"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createStripeCard,
  fundTestIssuingBalance,
  retrieveStripeCardDetails,
  simulateStripePayment,
} from "@/lib/stripe-helpers";
import { depositToVault } from "@/lib/rayls";

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

export async function getCardDetails(cardId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  return retrieveStripeCardDetails(cardId);
}

export async function fundBalance(amount: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  await fundTestIssuingBalance(amount);
  await depositToVault(session.user.id, amount);

  await db.insert(schema.fundTransfer).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    amount,
    currency: "eur",
    method: "ach",
  });

  return { funded: amount };
}

export async function simulatePayment(
  cardId: string,
  amount: number,
  merchantName: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  return simulateStripePayment({
    cardId,
    amount,
    merchantName,
  });
}
