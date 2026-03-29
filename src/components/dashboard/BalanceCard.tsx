"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowUpRight, ArrowLeftRight, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddFundsDialog } from "@/components/dashboard/AddFundsDialog";

type BalanceCardProps = {
  totalBalance: number;
};

export function BalanceCard({ totalBalance }: BalanceCardProps) {
  const [visible, setVisible] = useState(true);
  const [addFundsOpen, setAddFundsOpen] = useState(false);

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(totalBalance);

  return (
    <>
      <Card className="border-0 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
        <CardHeader className="items-center pb-2">
          <CardDescription className="flex items-center gap-2 text-zinc-300">
            Total Balance
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-zinc-400 hover:text-zinc-200 hover:bg-transparent"
              onClick={() => setVisible(!visible)}
            >
              {visible ? (
                <Eye className="size-3.5" />
              ) : (
                <EyeOff className="size-3.5" />
              )}
            </Button>
          </CardDescription>
          <CardTitle className="text-4xl font-bold tracking-tight text-white">
            {visible ? formatted : "••••••"}
            <span className="ml-1.5 text-sm font-normal text-zinc-400">
              usd
            </span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="justify-center gap-3 pb-6">
          <Button
            size="sm"
            className="rounded-full bg-zinc-700 px-4 text-white hover:bg-zinc-600"
            onClick={() => setAddFundsOpen(true)}
          >
            <Plus className="size-3.5" />
            Add Funds
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-10 flex-col gap-1 rounded-full border border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            onClick={() => toast.info("Send — Coming soon")}
          >
            <ArrowUpRight className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-10 flex-col gap-1 rounded-full border border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            onClick={() => toast.info("Convert — Coming soon")}
          >
            <ArrowLeftRight className="size-4" />
          </Button>
        </CardFooter>
      </Card>
      <AddFundsDialog open={addFundsOpen} onOpenChange={setAddFundsOpen} />
    </>
  );
}
