'use client';

import { Stat, StatLabel, StatValue } from '@/components/ui/stat';

type AssetSpotToolbarProps = {
  asset: string;
};

export function AssetSpotToolbar({ asset: _asset }: AssetSpotToolbarProps) {
  // TODO: Implement with spot market data hook when available
  // For now, show placeholder stats relevant to spot trading

  return (
    <div className="flex shrink-0 items-center gap-8">
      <Stat>
        <StatLabel>Price</StatLabel>
        <StatValue>--</StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Change</StatLabel>
        <StatValue>--</StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Volume</StatLabel>
        <StatValue>--</StatValue>
      </Stat>
      <Stat>
        <StatLabel>Market Cap</StatLabel>
        <StatValue>--</StatValue>
      </Stat>
      <Stat>
        <StatLabel>Circulating Supply</StatLabel>
        <StatValue>--</StatValue>
      </Stat>
    </div>
  );
}
