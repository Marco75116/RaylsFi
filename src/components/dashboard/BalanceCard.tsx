"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type BalanceCardProps = {
  totalBalance: number;
};

export function BalanceCard({ totalBalance }: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(totalBalance);

  return (
    <Card className="border-0 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-300">Total Balance</p>
          <button
            onClick={() => setVisible(!visible)}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {visible ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4" />
            )}
          </button>
        </div>
        <p className="mt-2 text-4xl font-bold tracking-tight">
          {visible ? formatted : "••••••"}
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          Across all assets
        </p>
      </CardContent>
    </Card>
  );
}
