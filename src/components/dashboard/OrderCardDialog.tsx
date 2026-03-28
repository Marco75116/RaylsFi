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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wifi, CreditCard, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { createCard } from "@/app/(dashboard)/overview/cards/actions";
import { useRouter } from "next/navigation";

type CardType = "virtual" | "physical";

function CardPreview({ type }: { type: CardType }) {
  const isPhysical = type === "physical";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-[1.6/1] w-[280px] overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 p-5 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.2),transparent_50%)]" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <Image
              src="/rayls-icon.png"
              alt="Rayls"
              width={28}
              height={28}
              className="opacity-90"
            />
            <Wifi className="size-4 rotate-90 opacity-60" />
          </div>

          <div className="space-y-2">
            <p className="font-mono text-base tracking-[0.2em]">
              •••• •••• •••• ••••
            </p>
            <div className="flex items-end justify-between">
              <div className="flex gap-5">
                <div>
                  <p className="text-[9px] uppercase tracking-wider opacity-60">
                    EXP
                  </p>
                  <p className="font-mono text-xs">••/••</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider opacity-60">
                    CVV
                  </p>
                  <p className="font-mono text-xs">•••</p>
                </div>
              </div>
              <p className="text-base font-bold tracking-wider opacity-90">
                VISA
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="max-w-[280px] text-center text-sm text-muted-foreground">
        {isPhysical
          ? "Spend and withdraw money anywhere with this physical card."
          : "A digital-only card for your wallet. Spend and withdraw seamlessly."}
      </p>
    </div>
  );
}

export function OrderCardDialog() {
  const [open, setOpen] = useState(false);
  const [cardType, setCardType] = useState<CardType>("virtual");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await createCard(cardType);
        setOpen(false);
        setCardType("virtual");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to create card");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-full">
          Add Card
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Add a new card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup
            value={cardType}
            onValueChange={(v) => setCardType(v as CardType)}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="virtual"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors data-[state=checked]:border-purple-500 has-[[data-state=checked]]:border-purple-500"
            >
              <RadioGroupItem
                value="virtual"
                id="virtual"
                className="sr-only"
              />
              <CreditCard className="size-5 text-purple-500" />
              <span className="text-sm font-medium">Virtual Cards</span>
              <span className="text-center text-xs text-muted-foreground">
                Digital card for online usage
              </span>
            </Label>

            <Label
              htmlFor="physical"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors has-[[data-state=checked]]:border-purple-500"
            >
              <RadioGroupItem
                value="physical"
                id="physical"
                className="sr-only"
              />
              <CreditCard className="size-5 text-purple-500" />
              <span className="text-sm font-medium">Physical Cards</span>
              <span className="text-center text-xs text-muted-foreground">
                Card in your wallet. Spend and withdraw anywhere.
              </span>
            </Label>
          </RadioGroup>

          <div className="flex justify-center">
            <CardPreview type={cardType} />
          </div>

          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}

          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full rounded-full bg-purple-600 hover:bg-purple-700"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Get Your Card
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
