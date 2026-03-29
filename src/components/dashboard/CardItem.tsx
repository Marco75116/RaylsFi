"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Wifi } from "lucide-react";
import { Card as CardType } from "@/lib/types/dashboard";

type CardItemProps = {
  card: CardType;
};

const statusColors = {
  active: "bg-emerald-500",
  frozen: "bg-blue-500",
  pending: "bg-amber-500",
};

export function CardItem({ card }: CardItemProps) {
  const spentPercent = (card.spent / card.spendLimit) * 100;
  const formattedSpent = `$${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(card.spent)} USDr`;
  const formattedLimit = `$${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(card.spendLimit)} USDr`;

  return (
    <div className="space-y-4">
      <div
        className={`relative overflow-hidden rounded-2xl p-6 text-white ${
          card.type === "virtual"
            ? "bg-gradient-to-br from-zinc-800 to-zinc-900"
            : "bg-gradient-to-br from-indigo-600 to-indigo-800"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider opacity-70">
              {card.type} Card
            </p>
            <p className="text-sm font-medium">{card.cardHolder}</p>
          </div>
          <Wifi className="size-6 rotate-90 opacity-60" />
        </div>

        <div className="mt-8">
          <p className="font-mono text-lg tracking-[0.2em]">
            •••• •••• •••• {card.last4}
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider opacity-60">
              Expires
            </p>
            <p className="font-mono text-sm">{card.expiryDate}</p>
          </div>
          <CreditCard className="size-8 opacity-40" />
        </div>

        <Badge
          className={`absolute right-4 top-4 border-0 text-white ${statusColors[card.status]}`}
        >
          {card.status}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spend Limit</span>
            <span className="font-medium">
              {formattedSpent} / {formattedLimit}
            </span>
          </div>
          <Progress value={spentPercent} className="mt-2 h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
