'use client';

import { Countdown } from '@/components/ui/countdown';
import { Stat, StatLabel, StatValue } from '@/components/ui/stat';
import { StatChange } from '@/components/ui/stat-change';
import { useMetaAndAssetCtxs } from '@/hooks/use-meta-and-asset-ctxs';
import { formatNumber } from '@/lib/format';

type AssetPerpsToolbarProps = {
  asset: string;
};

const LOADING_STATS_COUNT = 6;
const PERCENTAGE_MULTIPLIER = 100;
const DECIMAL_PLACES_PRICE = 3;

export function AssetPerpsToolbar({ asset }: AssetPerpsToolbarProps) {
  const { data, isLoading, error } = useMetaAndAssetCtxs();

  if (isLoading) {
    return (
      <div className="flex shrink-0 items-center gap-8">
        {Array.from({ length: LOADING_STATS_COUNT }).map((_, i) => (
          <Stat key={`loading-${i}`}>
            <StatLabel>Loading...</StatLabel>
            <StatValue>--</StatValue>
          </Stat>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex shrink-0 items-center gap-8">
        <Stat>
          <StatLabel>Error</StatLabel>
          <StatValue>Failed to load data</StatValue>
        </Stat>
      </div>
    );
  }

  const [meta, assetCtxs] = data;
  const assetIndex = meta.universe.findIndex(
    (item) => item.name.toLowerCase() === asset.toLowerCase()
  );

  if (assetIndex === -1) {
    return (
      <div className="flex shrink-0 items-center gap-8">
        <Stat>
          <StatLabel>Asset</StatLabel>
          <StatValue>Not found</StatValue>
        </Stat>
      </div>
    );
  }

  const assetCtx = assetCtxs[assetIndex];

  // Calculate 24h change
  const markPx = Number.parseFloat(assetCtx.markPx);
  const prevDayPx = Number.parseFloat(assetCtx.prevDayPx);
  const change24h = markPx - prevDayPx;
  const changePercent24h = (change24h / prevDayPx) * PERCENTAGE_MULTIPLIER;

  // Format funding rate as percentage
  const fundingRate = Number.parseFloat(assetCtx.funding);

  // Calculate next hour for funding countdown
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);

  return (
    <div className="flex shrink-0 items-center gap-8">
      <Stat>
        <StatLabel>Mark</StatLabel>
        <StatValue>
          {Number.parseFloat(assetCtx.markPx).toFixed(DECIMAL_PLACES_PRICE)}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>Oracle</StatLabel>
        <StatValue>
          {Number.parseFloat(assetCtx.oraclePx).toFixed(DECIMAL_PLACES_PRICE)}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Change</StatLabel>
        <StatValue>
          <StatChange change={change24h}>
            {formatNumber(change24h, { display: 'usd' })} /{' '}
            {formatNumber(changePercent24h / PERCENTAGE_MULTIPLIER, {
              display: 'percent',
            })}
          </StatChange>
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Volume</StatLabel>
        <StatValue>
          {formatNumber(Number.parseFloat(assetCtx.dayNtlVlm), {
            display: 'usd',
          })}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>Open Interest</StatLabel>
        <StatValue>
          {formatNumber(Number.parseFloat(assetCtx.openInterest), {
            display: 'usd',
          })}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>Funding / Countdown</StatLabel>
        <StatValue className="flex items-center gap-2">
          <StatChange change={fundingRate}>
            {formatNumber(fundingRate, {
              display: 'percent',
              options: {
                maximumSignificantDigits: 2,
              },
            })}
          </StatChange>
          <Countdown target={nextHour} />
        </StatValue>
      </Stat>
    </div>
  );
}
