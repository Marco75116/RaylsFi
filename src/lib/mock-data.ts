import { Asset, Transaction, Card } from "@/lib/types/dashboard";

export const mockAssets: Asset[] = [
  {
    id: "1",
    name: "USDr",
    symbol: "USDr",
    color: "#2775CA",
    balance: 7254.45,
    usdValue: 7254.45,
    change24h: 0.0,
    price: 1.0,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "send",
    asset: "$USDr",
    subtitle: "Transfer",
    amount: 1.2,
    usdValue: 0,
    date: "2026-03-03T10:30:00Z",
    status: "completed",
  },
  {
    id: "2",
    type: "fund",
    asset: "$USDr",
    subtitle: undefined,
    amount: 1.2,
    usdValue: 2330.31,
    date: "2026-03-03T10:30:00Z",
    status: "completed",
  },
  {
    id: "3",
    type: "fund",
    asset: "$USDr",
    amount: 0.8,
    usdValue: 1500.31,
    date: "2026-03-03T09:00:00Z",
    status: "completed",
  },
  {
    id: "4",
    type: "purchase",
    asset: "COACH USA",
    amount: 26.0,
    usdValue: 26.0,
    date: "2026-02-25T14:20:00Z",
    status: "completed",
    cashback: 0.78,
  },
  {
    id: "5",
    type: "purchase",
    asset: "MTA*NYCT PAYGO",
    amount: 3.0,
    usdValue: 3.0,
    date: "2026-02-25T08:00:00Z",
    status: "completed",
    cashback: 0.09,
  },
  {
    id: "6",
    type: "purchase",
    asset: "MTA*NYCT PAYGO",
    amount: 3.0,
    usdValue: 3.0,
    date: "2026-02-25T07:00:00Z",
    status: "completed",
    cashback: 0.09,
  },
];

export const mockCards: Card[] = [
  {
    id: "1",
    type: "virtual",
    name: "wework",
    last4: "5186",
    status: "active",
    spendLimit: 5000,
    spent: 1247.5,
    expiryDate: "12/28",
    cardHolder: "MARC-ANTOINE",
  },
  {
    id: "2",
    type: "virtual",
    name: "Marc",
    last4: "4622",
    status: "active",
    spendLimit: 3000,
    spent: 820.0,
    expiryDate: "06/29",
    cardHolder: "MARC-ANTOINE",
  },
  {
    id: "3",
    type: "virtual",
    name: "m",
    last4: "0127",
    status: "active",
    spendLimit: 1000,
    spent: 150.0,
    expiryDate: "03/30",
    cardHolder: "MARC-ANTOINE",
  },
];

export const mockTotalBalance = 7254.45;
