"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { processCheckout } from "./actions";
import { FRENCH_MERCHANTS } from "@/lib/stripe-helpers";

function pickRandomMerchant(): string {
  return FRENCH_MERCHANTS[Math.floor(Math.random() * FRENCH_MERCHANTS.length)]
    .name;
}

function pickRandomAmount(): string {
  const amounts = [1.5, 2.5, 3.2, 4.9, 5.0, 6.3, 7.5, 8.0, 8.5, 9.9];
  return amounts[Math.floor(Math.random() * amounts.length)].toFixed(2);
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export default function CheckoutPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [merchantName, setMerchantName] = useState(pickRandomMerchant);
  const [amount, setAmount] = useState(pickRandomAmount);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    amount: number;
    merchantName: string;
    currency: string;
    txHash: string | null;
  } | null>(null);

  function parseExpiry(): { month: number; year: number } | null {
    const parts = expiry.split("/");
    if (parts.length !== 2) return null;
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
    if (!month || !year || month < 1 || month > 12) return null;
    return { month, year: 2000 + year };
  }

  function handleSubmit() {
    setError(null);

    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 15) {
      setError("Enter a valid card number");
      return;
    }

    const exp = parseExpiry();
    if (!exp) {
      setError("Enter a valid expiry date (MM/YY)");
      return;
    }

    if (cvc.length < 3) {
      setError("Enter a valid CVC");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (!merchantName.trim()) {
      setError("Enter a merchant name");
      return;
    }

    startTransition(async () => {
      try {
        const result = await processCheckout({
          cardNumber: digits,
          expMonth: exp.month,
          expYear: exp.year,
          cvc,
          merchantName: merchantName.trim(),
          amount: parsedAmount,
        });
        setSuccess(result);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Payment failed. Please try again.",
        );
      }
    });
  }

  function handleReset() {
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setMerchantName(pickRandomMerchant());
    setAmount(pickRandomAmount());
    setError(null);
    setSuccess(null);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/rayls-icon.png"
            alt="Rayls"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <h1 className="text-xl font-semibold tracking-tight">
            RaylsFi Checkout
          </h1>
        </div>

        <Card>
          {success ? (
            <CardContent className="flex flex-col items-center gap-4 py-10">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Payment successful</p>
                <p className="text-sm text-muted-foreground">
                  ${success.amount.toFixed(2)} USD at {success.merchantName}
                </p>
              </div>
              <div className="flex gap-2">
                {success.txHash && (
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
                )}
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={handleReset}
                >
                  New payment
                </Button>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-5" />
                  Payment details
                </CardTitle>
                <CardDescription>
                  Pay{" "}
                  <span className="font-medium text-foreground">
                    ${parseFloat(amount || "0").toFixed(2)} USD
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-foreground">
                    {merchantName || "merchant"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="merchant">Merchant</Label>
                    <Input
                      id="merchant"
                      placeholder="Merchant name"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
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
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card number</Label>
                    <Input
                      id="card-number"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      disabled={isPending}
                      maxLength={19}
                      autoComplete="cc-number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(formatExpiry(e.target.value))
                        }
                        disabled={isPending}
                        maxLength={5}
                        autoComplete="cc-exp"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) =>
                          setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        disabled={isPending}
                        maxLength={4}
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-center text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full gap-2 rounded-full bg-purple-600 hover:bg-purple-700"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                  Pay ${parseFloat(amount || "0").toFixed(2)} USD
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="size-3" />
                  Test environment — no real charges
                </div>
              </CardContent>
            </>
          )}
        </Card>

        <div className="text-center">
          <Button
            variant="link"
            asChild
            className="gap-1.5 text-muted-foreground"
          >
            <Link href="/overview">
              <ArrowLeft className="size-3.5" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
