import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 py-6">
      <Skeleton className="h-[140px] w-full rounded-xl" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
