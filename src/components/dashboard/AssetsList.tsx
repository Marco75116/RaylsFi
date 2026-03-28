import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset } from "@/lib/types/dashboard";

type AssetsListProps = {
  assets: Asset[];
};

export function AssetsList({ assets }: AssetsListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Assets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {assets.map((asset) => {
            const formattedBalance = new Intl.NumberFormat("en-US", {
              minimumFractionDigits: asset.balance < 10 ? 4 : 2,
              maximumFractionDigits: asset.balance < 10 ? 4 : 2,
            }).format(asset.balance);

            const formattedUsd = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(asset.usdValue);

            const changeColor =
              asset.change24h > 0
                ? "text-emerald-600"
                : asset.change24h < 0
                  ? "text-red-500"
                  : "text-muted-foreground";

            const changePrefix = asset.change24h > 0 ? "+" : "";

            return (
              <div
                key={asset.id}
                className="flex items-center justify-between px-6 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-9 items-center justify-center rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: asset.color }}
                  >
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formattedBalance} {asset.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formattedUsd}</p>
                  <p className={`text-xs ${changeColor}`}>
                    {changePrefix}
                    {asset.change24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
