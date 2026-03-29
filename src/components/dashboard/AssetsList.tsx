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
import { ChevronRight } from "lucide-react";
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
              minimumFractionDigits: asset.balance < 10 ? 4 : 2,
              maximumFractionDigits: asset.balance < 10 ? 4 : 2,
            }).format(asset.balance);

            const formattedUsd = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(asset.usdValue);

            const formattedPrice = asset.price
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(asset.price)
              : null;

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
                      <CardTitle className="text-sm">{asset.name}</CardTitle>
                      {asset.earnInfo && (
                        <CardDescription className="text-xs">
                          {asset.earnInfo}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formattedUsd}</p>
                      {formattedPrice && (
                        <CardDescription className="text-xs">
                          {formattedBalance} · {formattedPrice}
                        </CardDescription>
                      )}
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
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
            onClick={() => toast.info("Earn More — Coming soon")}
          >
            Earn More
          </Button>
        </CardFooter>
      </Card>
      <AddFundsDialog open={addFundsOpen} onOpenChange={setAddFundsOpen} />
    </>
  );
}
