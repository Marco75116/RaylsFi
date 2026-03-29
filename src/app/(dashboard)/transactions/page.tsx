import { headers } from "next/headers";
import { ContentLayout } from "@/components/admin-panel/ContentLayout";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { auth } from "@/lib/auth";
import { getUserTransactions } from "@/lib/transactions";

export default async function TransactionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const transactions = await getUserTransactions(session.user.id);

  return (
    <ContentLayout>
      <div className="w-full space-y-6 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage all your activity
          </p>
        </div>

        <TransactionsTable transactions={transactions} />
      </div>
    </ContentLayout>
  );
}
