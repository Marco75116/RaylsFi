"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Loader2,
  CheckCircle2,
  CreditCard,
  Shuffle,
  ExternalLink,
} from "lucide-react";
import { simulatePayment } from "@/app/(dashboard)/overview/cards/actions";
import { Card } from "@/lib/types/dashboard";
import { FRENCH_MERCHANTS } from "@/lib/stripe-helpers";

function pickRandomMerchant(): string {
  const merchant =
    FRENCH_MERCHANTS[Math.floor(Math.random() * FRENCH_MERCHANTS.length)];
  return merchant.name;
}

function pickRandomAmount() {
  const amounts = [2.5, 4.9, 8.5, 12.0, 15.9, 22.5, 35.0, 47.8, 65.0, 89.9];
  return amounts[Math.floor(Math.random() * amounts.length)].toFixed(2);
}

type SimulatePaymentDialogProps = {
  cards: Card[];
};

export function SimulatePaymentDialog({ cards }: SimulatePaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id ?? "");
  const [amount, setAmount] = useState(pickRandomAmount);
  const [merchantName, setMerchantName] = useState(pickRandomMerchant);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    amount: number;
    merchantName: string;
    txHash: string;
  } | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setAmount(pickRandomAmount());
      setMerchantName(pickRandomMerchant());
      setError(null);
      setSuccess(null);
      setSelectedCardId(cards[0]?.id ?? "");
    }
  }

  function handleSubmit() {
    setError(null);
    setSuccess(null);

    const cents = Math.round(parseFloat(amount) * 100);
    if (!cents || cents <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!merchantName.trim()) {
      setError("Enter a merchant name");
      return;
    }
    if (!selectedCardId) {
      setError("Select a card");
      return;
    }

    startTransition(async () => {
      try {
        const result = await simulatePayment(
          selectedCardId,
          cents,
          merchantName.trim(),
        );
        setSuccess({
          amount: result.amount / 100,
          merchantName: result.merchantName,
          txHash: result.txHash,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to simulate payment");
      }
    });
  }

  const selectedCard = cards.find((c) => c.id === selectedCardId);
  const activeCards = cards.filter((c) => c.status === "active");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-full">
          Simulate Payment
          <ShoppingCart className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Simulate a test payment
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="size-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Payment successful</p>
              <p className="text-sm text-muted-foreground">
                {success.amount.toFixed(2)} EUR at {success.merchantName}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 rounded-full"
                onClick={() =>
                  window.open(
                    `https://testnet-explorer.rayls.com/tx/${success.txHash}`,
                    "_blank",
                  )
                }
              >
                View tx
                <ExternalLink className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => handleOpenChange(false)}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-select">Card</Label>
              <div className="grid gap-2">
                {activeCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedCardId(card.id)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors ${
                      selectedCardId === card.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-border hover:border-purple-300"
                    }`}
                  >
                    <CreditCard className="size-5 shrink-0 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">•••• {card.last4}</p>
                      <p className="text-xs text-muted-foreground">
                        {card.cardHolder} · {card.type}
                      </p>
                    </div>
                    {selectedCardId === card.id && (
                      <div className="size-2 rounded-full bg-purple-500" />
                    )}
                  </button>
                ))}
              </div>
              {activeCards.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No active cards available
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchant-name">Merchant name</Label>
              <div className="flex gap-2">
                <Input
                  id="merchant-name"
                  placeholder="e.g. Carrefour, Boulangerie Paul"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  disabled={isPending}
                  onClick={() => {
                    setMerchantName(pickRandomMerchant());
                    setAmount(pickRandomAmount());
                  }}
                >
                  <Shuffle className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (EUR)</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending}
              />
            </div>

            {selectedCard && amount && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-center text-sm text-muted-foreground">
                  Charge{" "}
                  <span className="font-semibold text-foreground">
                    {parseFloat(amount || "0").toFixed(2)} EUR
                  </span>{" "}
                  to card ending in{" "}
                  <span className="font-semibold text-foreground">
                    {selectedCard.last4}
                  </span>
                </p>
              </div>
            )}

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={handleSubmit}
                disabled={isPending || activeCards.length === 0}
                className="w-full rounded-full bg-purple-600 hover:bg-purple-700"
              >
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Process Payment
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
