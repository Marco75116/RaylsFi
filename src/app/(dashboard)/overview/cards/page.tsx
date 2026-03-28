import { headers } from "next/headers";
import { ContentLayout } from "@/components/admin-panel/ContentLayout";
import { CardCarousel } from "@/components/dashboard/CardCarousel";
import { OrderCardDialog } from "@/components/dashboard/OrderCardDialog";
import { Separator } from "@/components/ui/separator";
import { CardsTable } from "@/components/dashboard/CardsTable";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { listStripeCards } from "@/lib/stripe-helpers";
import { Card } from "@/lib/types/dashboard";

async function getUserCards(): Promise<Card[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const dbUser = await db
    .select({ stripeCardholderId: schema.user.stripeCardholderId })
    .from(schema.user)
    .where(eq(schema.user.id, session.user.id))
    .then((rows) => rows[0]);

  if (!dbUser?.stripeCardholderId) return [];

  const stripeCards = await listStripeCards(dbUser.stripeCardholderId);

  return stripeCards.map((card) => ({
    id: card.id,
    type: "virtual" as const,
    name: card.cardholder
      ? typeof card.cardholder === "string"
        ? card.cardholder
        : card.cardholder.name
      : "",
    last4: card.last4 ?? "0000",
    status: card.status === "active" ? "active" : "frozen",
    spendLimit: card.spending_controls?.spending_limits?.[0]?.amount ?? 0,
    spent: 0,
    expiryDate: `${String(card.exp_month).padStart(2, "0")}/${String(card.exp_year).slice(-2)}`,
    cardHolder: card.cardholder
      ? typeof card.cardholder === "string"
        ? card.cardholder
        : card.cardholder.name
      : "",
  }));
}

export default async function CardsPage() {
  const cards = await getUserCards();

  return (
    <ContentLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6 py-6">
        <CardCarousel cards={cards} />

        <Separator />

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Your cards</h2>
          <OrderCardDialog />
        </div>

        <CardsTable cards={cards} />
      </div>
    </ContentLayout>
  );
}
