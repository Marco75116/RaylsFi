"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  Bitcoin,
  ChevronRight,
  Copy,
  AlertCircle,
  Loader2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { useSession } from "@/lib/auth-client";
import { fundBalance } from "@/app/(dashboard)/overview/cards/actions";

type View = "select" | "bank" | "crypto";

type AddFundsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const BANK_DETAILS = {
  fee: "$0",
  nameOfBank: "Lead Bank",
  accountNumber: "2107140647283",
  routingNumber: "101019644",
  bankAddress: "1801 Main St, Kansas City, MO 64108",
};

const TOKENS = [
  { value: "usdc", label: "USDC", icon: "circle" },
  { value: "usdt", label: "USDT", icon: "circle" },
  { value: "eth", label: "ETH", icon: "circle" },
] as const;

const NETWORKS = [
  { value: "base", label: "Base" },
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
] as const;

const DEPOSIT_ADDRESS = "0xE08cd6C8l7c7aBfD73lF5954dA0c3B8Ala8c23d3";

function BankTransferView({ userName }: { userName: string }) {
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  const rows = [
    { label: "Fee:", value: BANK_DETAILS.fee },
    { label: "Account holder name:", value: userName },
    { label: "Name of Bank:", value: BANK_DETAILS.nameOfBank },
    { label: "Account number:", value: BANK_DETAILS.accountNumber },
    { label: "Routing number:", value: BANK_DETAILS.routingNumber },
    { label: "Address of bank:", value: BANK_DETAILS.bankAddress },
  ];

  function handleCopyAll() {
    const text = rows.map((r) => `${r.label} ${r.value}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Bank details copied to clipboard");
  }

  function handleFund() {
    const cents = Math.round(parseFloat(amount) * 100);
    if (!cents || cents <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    startTransition(async () => {
      try {
        await fundBalance(cents);
        toast.success(`$${(cents / 100).toFixed(2)} funded to issuing balance`);
        setAmount("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to fund balance");
      }
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        To transfer, here&apos;s all you need:
      </p>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <span className="shrink-0 text-sm text-muted-foreground">
              {row.label}
            </span>
            <span className="text-right text-sm font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full gap-2 rounded-full"
        onClick={handleCopyAll}
      >
        <Copy className="size-4" />
        Copy All
      </Button>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-medium">Fund issuing balance (test)</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending}
              className="pl-9"
            />
          </div>
          <Button
            onClick={handleFund}
            disabled={isPending || !amount}
            className="rounded-full bg-purple-600 hover:bg-purple-700"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Fund"}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <AlertCircle className="size-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-900">Important</p>
            <ul className="list-disc space-y-1 pl-4 text-xs text-amber-800">
              <li>Only send USD via ACH</li>
              <li>Expect 1-5 working days processing time</li>
              <li>
                Minimum deposit of 2 USD. Max 4,000 USD when receiving from
                individuals. There&apos;s no limit when receiving from your own
                accounts or any business accounts.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CryptoDepositView() {
  const [token, setToken] = useState("usdc");
  const [network, setNetwork] = useState("base");

  const selectedToken = TOKENS.find((t) => t.value === token);
  const selectedNetwork = NETWORKS.find((n) => n.value === network);

  function handleCopy() {
    navigator.clipboard.writeText(DEPOSIT_ADDRESS);
    toast.success("Deposit address copied to clipboard");
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Select a token</label>
        <Select value={token} onValueChange={setToken}>
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOKENS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Select network</label>
        <Select value={network} onValueChange={setNetwork}>
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NETWORKS.map((n) => (
              <SelectItem key={n.value} value={n.value}>
                {n.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col items-center gap-3 py-2">
        <div className="rounded-xl bg-white p-3">
          <QRCodeSVG value={DEPOSIT_ADDRESS} size={160} />
        </div>
        <p className="text-sm text-muted-foreground">
          {selectedToken?.label} deposit address
        </p>
        <Button
          variant="outline"
          className="w-full gap-2 rounded-full font-mono text-xs"
          onClick={handleCopy}
        >
          {DEPOSIT_ADDRESS}
          <Copy className="size-3.5 shrink-0" />
        </Button>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <AlertCircle className="size-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-900">Reminder</p>
            <p className="text-xs text-amber-800">
              Only deposit {selectedToken?.label} from the{" "}
              {selectedNetwork?.label} network. Deposits of other assets or from
              other networks may be lost.
            </p>
          </div>
        </div>
      </div>

      <Button
        className="w-full rounded-full"
        onClick={() => toast.success("Deposit address shared")}
      >
        OK
      </Button>
    </div>
  );
}

export function AddFundsDialog({ open, onOpenChange }: AddFundsDialogProps) {
  const [view, setView] = useState<View>("select");
  const { data: session } = useSession();

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      setView("select");
    }
    onOpenChange(isOpen);
  }

  const title =
    view === "select"
      ? "Add Funds to Your Account"
      : view === "bank"
        ? "Transfer with ACH"
        : "Share deposit address";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {view !== "select" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4 size-8"
              onClick={() => setView("select")}
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
        </DialogHeader>

        {view === "select" && (
          <div className="space-y-3 py-2">
            <Button
              variant="outline"
              className="flex h-auto w-full items-center justify-between rounded-xl border-2 p-4 transition-colors hover:border-zinc-400"
              onClick={() => setView("bank")}
            >
              <div className="flex items-center gap-3">
                <Building2 className="size-6 text-blue-500" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Cash</p>
                  <p className="text-xs text-muted-foreground">
                    Deposit funds using a bank account.
                  </p>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              className="flex h-auto w-full items-center justify-between rounded-xl border-2 p-4 transition-colors hover:border-zinc-400"
              onClick={() => setView("crypto")}
            >
              <div className="flex items-center gap-3">
                <Bitcoin className="size-6 text-amber-500" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Crypto</p>
                  <p className="text-xs text-muted-foreground">
                    Receive assets from a wallet address or exchange.
                  </p>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Button>
          </div>
        )}

        {view === "bank" && (
          <BankTransferView userName={session?.user?.name ?? "—"} />
        )}

        {view === "crypto" && <CryptoDepositView />}
      </DialogContent>
    </Dialog>
  );
}
