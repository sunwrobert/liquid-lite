'use client';

import { useState } from 'react';

import { AssetPerpsStats } from '@/components/asset/asset-perps-stats';
import { AssetSelector } from '@/components/asset/asset-selector/asset-selector';

type AssetPerpsToolbarProps = {
  asset: string;
  onAssetChange?: (asset: string) => void;
};

export function AssetPerpsToolbar({
  asset,
  onAssetChange,
}: AssetPerpsToolbarProps) {
  const [selectedAsset, setSelectedAsset] = useState(asset);

  const handleAssetSelect = (newAsset: string) => {
    setSelectedAsset(newAsset);
    onAssetChange?.(newAsset);
  };

  return (
    <div className="flex shrink-0 items-center gap-8">
      <AssetSelector
        onAssetSelect={handleAssetSelect}
        selectedAsset={selectedAsset}
      />
      <AssetPerpsStats asset={selectedAsset} />
    </div>
  );
}
