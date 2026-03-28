import { ContentLayout } from "@/components/admin-panel/ContentLayout";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { mockTransactions } from "@/lib/mock-data";
export default function TransactionsPage() {
  return (
    <ContentLayout>
      <div className="w-full space-y-6 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage all your activity
          </p>
        </div>

        <TransactionsTable transactions={mockTransactions} />
      </div>
    </ContentLayout>
  );
}
