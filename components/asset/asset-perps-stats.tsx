'use client';

import { useMemo } from 'react';
import { ChangeAnimation } from '@/components/ui/change-animation';
import { Countdown } from '@/components/ui/countdown';
import { Stat, StatLabel, StatValue } from '@/components/ui/stat';
import { StatChange } from '@/components/ui/stat-change';
import { useMetaAndAssetCtxs } from '@/hooks/use-meta-and-asset-ctxs';
import { formatNumber } from '@/lib/format';

type AssetPerpsStatsProps = {
  asset: string;
};

export function AssetPerpsStats({ asset }: AssetPerpsStatsProps) {
  const { data, isLoading, error } = useMetaAndAssetCtxs({
    asset,
  });

  const assetKey = asset.toLowerCase();
  const assetCtx = data?.assets[assetKey];

  // Memoize expensive calculations
  const calculations = useMemo(() => {
    if (!assetCtx) {
      return null;
    }

    const markPx = Number.parseFloat(assetCtx.markPx);
    const prevDayPx = Number.parseFloat(assetCtx.prevDayPx);
    const change24h = markPx - prevDayPx;
    const changePercent24h = (change24h / prevDayPx) * 100;
    const fundingRate = Number.parseFloat(assetCtx.funding);

    // Calculate next hour for funding countdown
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);

    return {
      markPx,
      prevDayPx,
      change24h,
      changePercent24h,
      fundingRate,
      nextHour,
    };
  }, [assetCtx]);

  if (isLoading) {
    return null;
  }

  if (error || !data || !assetCtx || !calculations) {
    return (
      <Stat>
        <StatLabel>Asset</StatLabel>
        <StatValue>Error</StatValue>
      </Stat>
    );
  }

  return (
    <>
      <Stat>
        <StatLabel>Mark</StatLabel>
        <StatValue>
          <ChangeAnimation value={calculations.markPx}>
            {formatNumber(calculations.markPx, {
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
        <StatValue>
          {formatNumber(Number.parseFloat(assetCtx.oraclePx), {
            display: 'standard',
          })}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Change</StatLabel>
        <StatValue>
          <StatChange change={calculations.change24h}>
            {formatNumber(calculations.change24h, {
              display: 'standard',
              options: {
                minimumSignificantDigits: 4,
                maximumSignificantDigits: 4,
              },
            })}{' '}
            /{' '}
            {formatNumber(calculations.changePercent24h / 100, {
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
          <StatChange change={calculations.fundingRate} contrast>
            {formatNumber(calculations.fundingRate, {
              display: 'percent',
              options: {
                maximumSignificantDigits: 2,
              },
            })}
          </StatChange>
          <Countdown target={calculations.nextHour} />
        </StatValue>
      </Stat>
    </>
  );
}
