"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Download,
  CreditCard,
  Plus,
  Search,
} from "lucide-react";
import { Transaction } from "@/lib/types/dashboard";
import { format } from "date-fns";

type TransactionsTableProps = {
  transactions: Transaction[];
};

const typeConfig = {
  receive: {
    icon: ArrowDownLeft,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    sign: "+",
    label: "Received",
  },
  send: {
    icon: ArrowUpRight,
    color: "text-red-500",
    bgColor: "bg-red-50",
    sign: "-",
    label: "Sent",
  },
  swap: {
    icon: ArrowLeftRight,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    sign: "",
    label: "Swap",
  },
  deposit: {
    icon: Download,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    sign: "+",
    label: "Deposit",
  },
  purchase: {
    icon: CreditCard,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    sign: "-",
    label: "Purchase",
  },
};

const statusVariant: Record<
  Transaction["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "secondary",
  pending: "outline",
  failed: "destructive",
};

type FilterTab = "all" | Transaction["type"];

function formatAmount(tx: Transaction, sign: string) {
  const fmt = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  if (tx.type === "purchase") {
    return `- ${fmt(tx.amount)}`;
  }
  if (tx.usdValue > 0) {
    return `${sign} ${fmt(tx.usdValue)}`;
  }
  return `${sign} ${fmt(tx.amount)}`;
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((tx) => {
    const matchesTab = activeTab === "all" || tx.type === activeTab;
    const matchesSearch =
      search === "" ||
      tx.asset.toLowerCase().includes(search.toLowerCase()) ||
      (tx.subtitle?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesTab && matchesSearch;
  });

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">All Transactions</CardTitle>
            <CardDescription className="text-xs">
              {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="h-9 pl-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="receive">Received</TabsTrigger>
            <TabsTrigger value="send">Sent</TabsTrigger>
            <TabsTrigger value="purchase">Purchases</TabsTrigger>
            <TabsTrigger value="swap">Swaps</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((tx) => {
                const config = typeConfig[tx.type];
                const Icon = tx.type === "receive" ? Plus : config.icon;

                return (
                  <TableRow
                    key={tx.id}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className={config.bgColor}>
                            <Icon className={`size-3.5 ${config.color}`} />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {config.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{tx.asset}</p>
                        {tx.subtitle && (
                          <p className="text-xs text-muted-foreground">
                            {tx.subtitle}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(tx.date), "MMM d, yyyy")}
                      <span className="ml-1 text-xs">
                        {format(new Date(tx.date), "h:mm a")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[tx.status]}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="text-sm font-medium">
                        {formatAmount(tx, config.sign)}
                      </p>
                      {tx.cashback !== undefined && tx.cashback > 0 && (
                        <p className="text-xs text-emerald-600">
                          +${tx.cashback.toFixed(2)} cashback
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
