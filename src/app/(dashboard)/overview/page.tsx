import { ContentLayout } from "@/components/admin-panel/ContentLayout";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { AssetsList } from "@/components/dashboard/AssetsList";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import {
  mockAssets,
  mockTransactions,
  mockTotalBalance,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <ContentLayout>
      <div className="mx-auto w-full max-w-2xl space-y-6 py-6">
        <BalanceCard totalBalance={mockTotalBalance} />
        <AssetsList assets={mockAssets} />
        <TransactionsList transactions={mockTransactions} />
      </div>
    </ContentLayout>
  );
}
