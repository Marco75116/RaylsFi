export type Asset = {
  id: string;
  name: string;
  symbol: string;
  color: string;
  icon?: string;
  balance: number;
  usdValue: number;
  change24h: number;
  earnInfo?: string;
  price?: number;
};

export type Transaction = {
  id: string;
  type: "send" | "fund" | "swap" | "deposit" | "purchase";
  asset: string;
  subtitle?: string;
  amount: number;
  usdValue: number;
  date: string;
  status: "completed" | "pending" | "failed";
  counterparty?: string;
  cashback?: number;
};

export type Card = {
  id: string;
  type: "virtual";
  name: string;
  last4: string;
  status: "active" | "frozen" | "pending";
  spendLimit: number;
  spent: number;
  expiryDate: string;
  cardHolder: string;
};
