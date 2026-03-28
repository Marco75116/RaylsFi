import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function CardsLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 py-6">
      <div className="flex items-center justify-center gap-6 py-8">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-[200px] w-[320px] rounded-2xl" />
        <Skeleton className="size-10 rounded-full" />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
