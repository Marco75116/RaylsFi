import { headers } from "next/headers";
import { ContentLayout } from "@/components/admin-panel/ContentLayout";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { AssetsList } from "@/components/dashboard/AssetsList";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { auth } from "@/lib/auth";
import { getUserTransactions, getUserBalance } from "@/lib/transactions";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [transactions, balance] = session
    ? await Promise.all([
        getUserTransactions(session.user.id),
        getUserBalance(session.user.id),
      ])
    : [[], 0];

  const assets = [
    {
      id: "1",
      name: "USDr",
      symbol: "USDr",
      color: "#2775CA",
      balance,
      usdValue: balance,
      change24h: 0,
      price: 1.0,
    },
  ];

  return (
    <ContentLayout>
      <div className="mx-auto w-full max-w-2xl space-y-6 py-6">
        <BalanceCard totalBalance={balance} />
        <AssetsList assets={assets} />
        <TransactionsList transactions={transactions} />
      </div>
    </ContentLayout>
  );
}
