"use client";

import { useState } from "react";
import { Card as CardType } from "@/lib/types/dashboard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Wifi } from "lucide-react";
import Image from "next/image";

type CardCarouselProps = {
  cards: CardType[];
};

function CardVisual({ card }: { card: CardType }) {
  return (
    <div className="relative aspect-[1.6/1] w-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 p-6 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.2),transparent_50%)]" />

      <div className="relative flex h-full flex-col justify-between">
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
            <p className="text-lg font-bold tracking-wider opacity-90">VISA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardCarousel({ cards }: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  if (cards.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 py-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrev}
        className="size-10 rounded-full text-muted-foreground"
      >
        <ChevronLeft className="size-5" />
      </Button>

      <div className="relative">
        {cards.map((card, index) => {
          const offset = index - activeIndex;
          const isActive = index === activeIndex;

          return (
            <div
              key={card.id}
              className="transition-all duration-300 ease-in-out"
              style={{
                position: isActive ? "relative" : "absolute",
                top: isActive ? 0 : "50%",
                left: "50%",
                transform: isActive
                  ? "none"
                  : `translate(-50%, -50%) scale(${0.9 - Math.abs(offset) * 0.05}) translateX(${offset * 40}px)`,
                opacity: isActive ? 1 : 0.4,
                zIndex: isActive ? 10 : 10 - Math.abs(offset),
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <CardVisual card={card} />
            </div>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="size-10 rounded-full text-muted-foreground"
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
