export type Asset = {
  id: string;
  name: string;
  symbol: string;
  color: string;
  balance: number;
  usdValue: number;
  change24h: number;
};

export type Transaction = {
  id: string;
  type: "send" | "receive" | "swap" | "deposit";
  asset: string;
  amount: number;
  usdValue: number;
  date: string;
  status: "completed" | "pending" | "failed";
  counterparty?: string;
};

export type Card = {
  id: string;
  type: "virtual" | "physical";
  last4: string;
  status: "active" | "frozen" | "pending";
  spendLimit: number;
  spent: number;
  expiryDate: string;
  cardHolder: string;
};
