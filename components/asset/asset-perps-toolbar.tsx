'use client';

import { ChangeAnimation } from '@/components/ui/change-animation';
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

export function AssetPerpsToolbar({ asset }: AssetPerpsToolbarProps) {
  const { data, isLoading, error } = useMetaAndAssetCtxs({ asset });

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

  const assetKey = asset.toLowerCase();
  const assetCtx = data.assets[assetKey];

  if (!assetCtx) {
    return (
      <div className="flex shrink-0 items-center gap-8">
        <Stat>
          <StatLabel>Asset</StatLabel>
          <StatValue>Not found</StatValue>
        </Stat>
      </div>
    );
  }

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
        <StatValue className="font-mono-numbers">
          <ChangeAnimation value={markPx}>
            {formatNumber(markPx, {
              display: 'standard',
              options: {
                minimumSignificantDigits: 5,
                maximumSignificantDigits: 5,
              },
            })}
          </ChangeAnimation>
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>Oracle</StatLabel>
        <StatValue className="font-mono-numbers">
          {formatNumber(Number.parseFloat(assetCtx.oraclePx), {
            display: 'standard',
          })}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Change</StatLabel>
        <StatValue className="font-mono-numbers">
          <StatChange change={change24h}>
            {formatNumber(change24h, {
              display: 'standard',
              options: {
                minimumSignificantDigits: 4,
                maximumSignificantDigits: 4,
              },
            })}{' '}
            /{' '}
            {formatNumber(changePercent24h / PERCENTAGE_MULTIPLIER, {
              display: 'percent',
            })}
          </StatChange>
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Volume</StatLabel>
        <StatValue className="font-mono-numbers">
          {formatNumber(Number.parseFloat(assetCtx.dayNtlVlm), {
            display: 'usd',
          })}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>Open Interest</StatLabel>
        <StatValue className="font-mono-numbers">
          {formatNumber(Number.parseFloat(assetCtx.openInterest), {
            display: 'usd',
          })}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>Funding / Countdown</StatLabel>
        <StatValue className="flex items-center gap-2 font-mono-numbers">
          <StatChange change={fundingRate} contrast>
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
