'use client';

import { AssetPerpsStats } from '@/components/asset/asset-perps-stats';
import { AssetSelector } from '@/components/asset/asset-selector/asset-selector';
import { useTradeContext } from '@/providers/trade-provider';

export function AssetPerpsToolbar() {
  const { asset } = useTradeContext();
  return (
    <div className="flex shrink-0 items-center gap-8">
      <AssetSelector selectedAsset={asset} />
      <AssetPerpsStats asset={asset} />
    </div>
  );
}
