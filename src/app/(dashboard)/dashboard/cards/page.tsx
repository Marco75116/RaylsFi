import { ContentLayout } from "@/components/admin-panel/ContentLayout";
import { CardItem } from "@/components/dashboard/CardItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockCards } from "@/lib/mock-data";

export default function CardsPage() {
  return (
    <ContentLayout>
      <div className="mx-auto w-full max-w-2xl space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Cards</h1>
            <p className="text-sm text-muted-foreground">
              Manage your virtual and physical cards
            </p>
          </div>
          <Button disabled className="gap-2">
            <Plus className="size-4" />
            Request Card
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {mockCards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
