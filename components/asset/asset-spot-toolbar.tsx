'use client';

import { AssetSelector } from '@/components/asset/asset-selector/asset-selector';
import { AssetSpotStats } from '@/components/asset/asset-spot-stats';
import { useTradeContext } from '@/providers/trade-provider';

export function AssetSpotToolbar() {
  const { asset } = useTradeContext();
  return (
    <div className="flex shrink-0 items-center gap-8">
      <AssetSelector selectedAsset={asset} />
      <AssetSpotStats asset={asset} />
    </div>
  );
}
