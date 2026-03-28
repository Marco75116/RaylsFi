"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/lib/types/dashboard";
import { CardDetailsDialog } from "@/components/dashboard/CardDetailsDialog";

type CardsTableProps = {
  cards: Card[];
};

export function CardsTable({ cards }: CardsTableProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Card holder</TableHead>
            <TableHead>Card</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => (
            <TableRow
              key={card.id}
              className="cursor-pointer"
              onClick={() => setSelectedCard(card)}
            >
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
                  className={
                    card.status === "active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-600"
                  }
                >
                  {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCard && (
        <CardDetailsDialog
          card={selectedCard}
          open
          onOpenChange={(open) => {
            if (!open) setSelectedCard(null);
          }}
        />
      )}
    </>
  );
}
