"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Asset } from "@/lib/types/dashboard";
import { toast } from "sonner";
import { useState } from "react";
import { AddFundsDialog } from "@/components/dashboard/AddFundsDialog";

type AssetsListProps = {
  assets: Asset[];
};

export function AssetsList({ assets }: AssetsListProps) {
  const [addFundsOpen, setAddFundsOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Assets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {assets.map((asset, index) => {
            const formattedBalance = new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(asset.balance);

            const formattedUsd = `$${new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(asset.usdValue)}`;

            return (
              <div key={asset.id}>
                {index > 0 && <Separator />}
                <div className="flex items-center justify-between px-6 py-3 cursor-pointer transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback
                        className="text-xs font-bold text-white"
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.symbol.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <CardTitle className="text-sm">{asset.name}</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Yield generated from public chain DeFi
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-xs font-medium text-emerald-600">
                        +3.1%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formattedBalance} USDr
                    </p>
                    <CardDescription className="text-xs">
                      {formattedUsd}
                    </CardDescription>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setAddFundsOpen(true)}
          >
            Add Funds
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => toast.info("Buy Stocks — Coming soon")}
          >
            Buy Stocks
          </Button>
        </CardFooter>
      </Card>
      <AddFundsDialog open={addFundsOpen} onOpenChange={setAddFundsOpen} />
    </>
  );
}
