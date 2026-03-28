import { ContentLayout } from "@/components/admin-panel/ContentLayout";
import { CardCarousel } from "@/components/dashboard/CardCarousel";
import { OrderCardDialog } from "@/components/dashboard/OrderCardDialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockCards } from "@/lib/mock-data";

export default function CardsPage() {
  return (
    <ContentLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6 py-6">
        <CardCarousel cards={mockCards} />

        <Separator />

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Your cards</h2>
          <OrderCardDialog />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Card holder</TableHead>
              <TableHead>Card</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="font-medium">{card.cardHolder}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    ..{card.last4} {card.name}
                    <Badge variant="secondary" className="text-[10px]">
                      {card.type.toUpperCase()}
                    </Badge>
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  >
                    {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  );
}
