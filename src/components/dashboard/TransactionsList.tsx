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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Download,
  CreditCard,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Transaction } from "@/lib/types/dashboard";
import { format } from "date-fns";
import { toast } from "sonner";

type TransactionsListProps = {
  transactions: Transaction[];
};

const typeConfig = {
  receive: {
    icon: ArrowDownLeft,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    sign: "+",
  },
  send: {
    icon: ArrowUpRight,
    color: "text-red-500",
    bgColor: "bg-red-50",
    sign: "-",
  },
  swap: {
    icon: ArrowLeftRight,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    sign: "",
  },
  deposit: {
    icon: Download,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    sign: "+",
  },
  purchase: {
    icon: CreditCard,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    sign: "-",
  },
};

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const key = format(new Date(tx.date), "EEE, MMM d, yyyy");
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  }
  return groups;
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const grouped = groupByDate(transactions);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {Object.entries(grouped).map(([dateLabel, txs], groupIndex) => (
          <div key={dateLabel}>
            {groupIndex > 0 && <Separator />}
            <CardDescription className="px-6 py-2 text-xs font-medium">
              {dateLabel}
            </CardDescription>
            {txs.map((tx, txIndex) => {
              const config = typeConfig[tx.type];
              const Icon = tx.type === "receive" ? Plus : config.icon;

              const formattedAmount =
                tx.type === "purchase"
                  ? `– $${tx.amount.toFixed(2)} USD`
                  : tx.usdValue > 0
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(tx.usdValue)
                    : `${config.sign} ${tx.amount.toFixed(2)}`;

              return (
                <div key={tx.id}>
                  {txIndex > 0 && <Separator className="mx-6 w-auto" />}
                  <div className="flex items-center justify-between px-6 py-3 cursor-pointer transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className={config.bgColor}>
                          <Icon className={`size-4 ${config.color}`} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-sm">{tx.asset}</CardTitle>
                        {tx.subtitle && (
                          <CardDescription className="text-xs">
                            {tx.subtitle}
                          </CardDescription>
                        )}
                        {tx.type === "purchase" && (
                          <Badge
                            variant="secondary"
                            className="mt-0.5 bg-emerald-50 px-1.5 py-0 text-[10px] text-emerald-600 hover:bg-emerald-50"
                          >
                            Cashback
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">{formattedAmount}</p>
                        {tx.cashback !== undefined && tx.cashback > 0 && (
                          <p className="text-xs text-emerald-600">
                            + ${tx.cashback.toFixed(2)} USD
                          </p>
                        )}
                        {tx.type === "send" && tx.usdValue === 0 && (
                          <p className="text-xs text-emerald-600">
                            + {tx.amount.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={() => toast.info("View All Transactions — Coming soon")}
        >
          View All Transactions
        </Button>
      </CardFooter>
    </Card>
  );
}
