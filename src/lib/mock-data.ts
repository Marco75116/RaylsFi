import { Asset, Transaction, Card } from "@/lib/types/dashboard";

export const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Liquid ETH",
    symbol: "ETH",
    color: "#627EEA",
    balance: 1.5,
    usdValue: 3050.46,
    change24h: 2.34,
    earnInfo: "5 Earn with Liquid",
    price: 2033.64,
  },
  {
    id: "2",
    name: "USDT",
    symbol: "USDT",
    color: "#26A17B",
    balance: 12.34,
    usdValue: 12.34,
    change24h: -0.02,
    earnInfo: "1 Earn with Liquid",
    price: 1.0,
  },
  {
    id: "3",
    name: "Liquid USD",
    symbol: "USD",
    color: "#2775CA",
    balance: 0.12,
    usdValue: 0.12,
    change24h: 0.0,
    price: 1.0,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "send",
    asset: "WETH",
    subtitle: "liquidETH",
    amount: 1.2,
    usdValue: 0,
    date: "2026-03-03T10:30:00Z",
    status: "completed",
  },
  {
    id: "2",
    type: "receive",
    asset: "WETH",
    subtitle: "1.20",
    amount: 1.2,
    usdValue: 2330.31,
    date: "2026-03-03T10:30:00Z",
    status: "completed",
  },
  {
    id: "3",
    type: "receive",
    asset: "WETH",
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
    last4: "4829",
    status: "active",
    spendLimit: 5000,
    spent: 1247.5,
    expiryDate: "12/28",
    cardHolder: "RAYLS USER",
  },
];

export const mockTotalBalance = 7254.45;
