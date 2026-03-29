import { headers } from "next/headers";
import { ContentLayout } from "@/components/admin-panel/ContentLayout";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { AssetsList } from "@/components/dashboard/AssetsList";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { mockAssets, mockTotalBalance } from "@/lib/mock-data";
import { auth } from "@/lib/auth";
import { getUserTransactions } from "@/lib/transactions";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const transactions = session
    ? await getUserTransactions(session.user.id)
    : [];

  return (
    <ContentLayout>
      <div className="mx-auto w-full max-w-2xl space-y-6 py-6">
        <BalanceCard totalBalance={mockTotalBalance} />
        <AssetsList assets={mockAssets} />
        <TransactionsList transactions={transactions} />
      </div>
    </ContentLayout>
  );
}
