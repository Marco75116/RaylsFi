import { Skeleton } from "@/components/ui/skeleton";

export default function CardsLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 py-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-[200px] rounded-2xl" />
            <Skeleton className="h-[72px] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
