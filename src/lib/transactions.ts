import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { getStripe } from "@/lib/stripe";
import { listStripeCards } from "@/lib/stripe-helpers";
import { Transaction } from "@/lib/types/dashboard";

async function getFundTransactions(userId: string): Promise<Transaction[]> {
  const rows = await db
    .select()
    .from(schema.fundTransfer)
    .where(eq(schema.fundTransfer.userId, userId))
    .orderBy(desc(schema.fundTransfer.createdAt));

  return rows.map((row) => ({
    id: row.id,
    type: "fund" as const,
    asset: `${row.amount / 100} USDr`,
    subtitle: row.method.toUpperCase(),
    amount: row.amount / 100,
    usdValue: row.amount / 100,
    date: row.createdAt.toISOString(),
    status: "completed" as const,
  }));
}

async function getPurchaseTransactions(userId: string): Promise<Transaction[]> {
  const dbUser = await db
    .select({ stripeCardholderId: schema.user.stripeCardholderId })
    .from(schema.user)
    .where(eq(schema.user.id, userId))
    .then((rows) => rows[0]);

  if (!dbUser?.stripeCardholderId) return [];

  const cards = await listStripeCards(dbUser.stripeCardholderId);
  if (cards.length === 0) return [];

  const stripe = getStripe();
  const allTransactions: Transaction[] = [];

  for (const card of cards) {
    const stripeTransactions = await stripe.issuing.transactions.list({
      card: card.id,
    });

    for (const tx of stripeTransactions.data) {
      allTransactions.push({
        id: tx.id,
        type: "purchase" as const,
        asset: tx.merchant_data.name ?? "Unknown merchant",
        subtitle: `${tx.merchant_data.city ?? ""} · 💳 ${card.last4}`,
        amount: Math.abs(tx.amount) / 100,
        usdValue: Math.abs(tx.amount) / 100,
        date: new Date(tx.created * 1000).toISOString(),
        status: "completed" as const,
      });
    }
  }

  return allTransactions;
}

export async function getUserBalance(userId: string): Promise<number> {
  const [fundTxs, purchaseTxs] = await Promise.all([
    getFundTransactions(userId),
    getPurchaseTransactions(userId),
  ]);

  const totalFunds = fundTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = purchaseTxs.reduce((sum, tx) => sum + tx.amount, 0);

  return totalFunds - totalSpent;
}

export async function getUserTransactions(
  userId: string,
): Promise<Transaction[]> {
  const [fundTxs, purchaseTxs] = await Promise.all([
    getFundTransactions(userId),
    getPurchaseTransactions(userId),
  ]);

  return [...fundTxs, ...purchaseTxs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
