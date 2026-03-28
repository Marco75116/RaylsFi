import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 py-6">
      <Skeleton className="h-[180px] w-full rounded-xl" />
      <Skeleton className="h-[80px] w-full rounded-xl" />
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
