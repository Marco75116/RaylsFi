import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 text-center px-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Wallet className="size-8" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            RaylsFi
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Your Web3 Card Dashboard. Manage crypto assets, cards, and
            transactions in one place.
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/sign-in">
            Get Started
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
