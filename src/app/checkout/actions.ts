"use server";

import { getStripe } from "@/lib/stripe";
import { simulateStripePayment } from "@/lib/stripe-helpers";
import { withdrawFromVault } from "@/lib/rayls";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

interface CheckoutInput {
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  merchantName: string;
  amount: number;
}

export async function processCheckout(input: CheckoutInput) {
  const stripe = getStripe();
  const last4 = input.cardNumber.slice(-4);

  const cards = await stripe.issuing.cards.list({ last4, limit: 100 });

  if (cards.data.length === 0) {
    throw new Error("Card not found. Please check the card number.");
  }

  const matchingCard = cards.data.find(
    (c) => c.exp_month === input.expMonth && c.exp_year === input.expYear,
  );

  if (!matchingCard) {
    throw new Error("Card not found. Please check the expiry date.");
  }

  const detailed = await stripe.issuing.cards.retrieve(matchingCard.id, {
    expand: ["number", "cvc"],
  });

  if (detailed.number !== input.cardNumber.replace(/\s/g, "")) {
    throw new Error("Invalid card number.");
  }

  if (detailed.cvc !== input.cvc) {
    throw new Error("Invalid CVC.");
  }

  if (matchingCard.status !== "active") {
    throw new Error("This card is not active.");
  }

  const cents = Math.round(input.amount * 100);

  const result = await simulateStripePayment({
    cardId: matchingCard.id,
    amount: cents,
    merchantName: input.merchantName,
  });

  const cardholderId =
    typeof matchingCard.cardholder === "string"
      ? matchingCard.cardholder
      : matchingCard.cardholder.id;

  const user = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(eq(schema.user.stripeCardholderId, cardholderId))
    .then((rows) => rows[0]);

  let txHash: string | null = null;
  if (user) {
    txHash = await withdrawFromVault(user.id, cents);
  }

  return {
    amount: result.amount / 100,
    merchantName: result.merchantName,
    currency: result.currency,
    txHash,
  };
}
