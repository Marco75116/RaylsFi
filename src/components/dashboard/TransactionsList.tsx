import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Download,
} from "lucide-react";
import { Transaction } from "@/lib/types/dashboard";
import { format } from "date-fns";

type TransactionsListProps = {
  transactions: Transaction[];
};

const typeConfig = {
  receive: {
    icon: ArrowDownLeft,
    label: "Received",
    color: "text-emerald-600",
    prefix: "+",
  },
  send: {
    icon: ArrowUpRight,
    label: "Sent",
    color: "text-red-500",
    prefix: "-",
  },
  swap: {
    icon: ArrowLeftRight,
    label: "Swapped",
    color: "text-blue-500",
    prefix: "",
  },
  deposit: {
    icon: Download,
    label: "Deposited",
    color: "text-emerald-600",
    prefix: "+",
  },
};

const statusVariant = {
  completed: "default" as const,
  pending: "secondary" as const,
  failed: "destructive" as const,
};

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {transactions.map((tx) => {
            const config = typeConfig[tx.type];
            const Icon = config.icon;
            const formattedUsd = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tx.usdValue);

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between px-6 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                    <Icon className={`size-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {config.label} {tx.asset}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(tx.date), "MMM d, yyyy")}
                      {tx.counterparty && ` · ${tx.counterparty}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`text-sm font-medium ${config.color}`}>
                    {config.prefix}
                    {formattedUsd}
                  </p>
                  <Badge
                    variant={statusVariant[tx.status]}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
