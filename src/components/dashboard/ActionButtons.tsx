"use client";

import { Plus, ArrowUpRight, ArrowLeftRight, CreditCard } from "lucide-react";
import { toast } from "sonner";

const actions = [
  { label: "Add Cash", icon: Plus },
  { label: "Send", icon: ArrowUpRight },
  { label: "Swap", icon: ArrowLeftRight },
  { label: "Card", icon: CreditCard },
];

export function ActionButtons() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => toast.info(`${label} — Coming soon`)}
          className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
