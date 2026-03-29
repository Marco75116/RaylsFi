"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Snowflake, ShieldCheck, Wifi } from "lucide-react";
import Image from "next/image";
import { Card } from "@/lib/types/dashboard";
import {
  getCardDetails,
  toggleCardStatus,
} from "@/app/(dashboard)/overview/cards/actions";

type CardDetails = {
  number: string | null;
  cvc: string | null;
};

function CardFace({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 p-6 text-white shadow-2xl backface-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.2),transparent_50%)]" />
      <div className="relative flex h-full flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

function CardFlip({
  card,
  details,
  flipped,
}: {
  card: Card;
  details: CardDetails | null;
  flipped: boolean;
}) {
  const displayNumber = details?.number
    ? details.number.replace(/(.{4})/g, "$1 ").trim()
    : `•••• •••• •••• ${card.last4}`;
  const displayCvc = details?.cvc ?? "•••";

  return (
    <div className="aspect-[1.6/1] w-[320px]" style={{ perspective: "1000px" }}>
      <div
        className="relative h-full w-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <CardFace>
          <div className="flex items-start justify-between">
            <Image
              src="/rayls-icon.png"
              alt="Rayls"
              width={32}
              height={32}
              className="opacity-90"
            />
            <Wifi className="size-5 rotate-90 opacity-60" />
          </div>
          <div className="space-y-3">
            <p className="font-mono text-lg tracking-[0.2em]">
              •••• •••• •••• {card.last4}
            </p>
            <div className="flex items-end justify-between">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">
                    EXP
                  </p>
                  <p className="font-mono text-xs">{card.expiryDate}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">
                    CVV
                  </p>
                  <p className="font-mono text-xs">•••</p>
                </div>
              </div>
              <p className="text-lg font-bold tracking-wider opacity-90">
                VISA
              </p>
            </div>
          </div>
        </CardFace>

        <CardFace className="rotate-y-180">
          <div className="flex items-start justify-between">
            <Image
              src="/rayls-icon.png"
              alt="Rayls"
              width={32}
              height={32}
              className="opacity-90"
            />
            <Wifi className="size-5 rotate-90 opacity-60" />
          </div>
          <div className="space-y-3">
            <p className="font-mono text-lg tracking-[0.2em]">
              {displayNumber}
            </p>
            <div className="flex items-end justify-between">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">
                    EXP
                  </p>
                  <p className="font-mono text-xs">{card.expiryDate}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">
                    CVV
                  </p>
                  <p className="font-mono text-xs">{displayCvc}</p>
                </div>
              </div>
              <p className="text-lg font-bold tracking-wider opacity-90">
                VISA
              </p>
            </div>
          </div>
        </CardFace>
      </div>
    </div>
  );
}

type CardDetailsDialogProps = {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CardDetailsDialog({
  card,
  open,
  onOpenChange,
}: CardDetailsDialogProps) {
  const [details, setDetails] = useState<CardDetails | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cardStatus, setCardStatus] = useState(card.status);
  const [isToggling, startToggleTransition] = useTransition();

  function handleReveal() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await getCardDetails(card.id);
        setDetails({ number: result.number, cvc: result.cvc });
        setFlipped(true);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to retrieve card details",
        );
      }
    });
  }

  function handleToggleStatus() {
    setError(null);
    const newStatus = cardStatus === "active" ? "inactive" : "active";
    startToggleTransition(async () => {
      try {
        await toggleCardStatus(card.id, newStatus);
        setCardStatus(newStatus === "active" ? "active" : "frozen");
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to update card status",
        );
      }
    });
  }

  function handleClose(value: boolean) {
    if (!value) {
      setDetails(null);
      setFlipped(false);
      setError(null);
    }
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Card details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <CardFlip card={card} details={details} flipped={flipped} />

          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3">
            {!flipped && (
              <Button
                onClick={handleReveal}
                disabled={isPending}
                variant="outline"
                className="gap-2 rounded-full"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Eye className="size-4" />
                )}
                Show card details
              </Button>
            )}

            {cardStatus !== "pending" && (
              <Button
                onClick={handleToggleStatus}
                disabled={isToggling}
                variant={cardStatus === "active" ? "outline" : "default"}
                className="gap-2 rounded-full"
              >
                {isToggling ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : cardStatus === "active" ? (
                  <Snowflake className="size-4" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
                {cardStatus === "active" ? "Freeze card" : "Unfreeze card"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
