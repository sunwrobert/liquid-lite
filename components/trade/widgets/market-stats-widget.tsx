'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatChange } from '@/components/ui/stat-change';
import { Text } from '@/components/ui/text';
import { useActiveAssetCtxSubscription } from '@/hooks/use-active-asset-ctx-subscription';
import type { TradingType } from '@/lib/cookies/trade';
import { formatPrice, formatVolume } from '@/lib/format';

type MarketStatsWidgetProps = {
  asset: string;
  tradingType: TradingType;
};

type MarketStats = {
  markPrice: string;
  prevDayPrice: string;
  change24h: number;
  volume24h: string;
  openInterest?: string;
  fundingRate?: string;
};

export function MarketStatsWidget({
  asset,
  tradingType,
}: MarketStatsWidgetProps) {
  const [stats, setStats] = useState<MarketStats | null>(null);

  useActiveAssetCtxSubscription({
    coin: asset,
    onResult: (data) => {
      if (data.coin === asset && data.ctx) {
        const ctx = data.ctx;
        const markPrice = ctx.markPx?.toString() || '0';
        const prevDayPrice = ctx.prevDayPx?.toString() || '0';
        const change24h =
          ((Number.parseFloat(markPrice) - Number.parseFloat(prevDayPrice)) /
            Number.parseFloat(prevDayPrice)) *
          100;

        const newStats: MarketStats = {
          markPrice,
          prevDayPrice,
          change24h,
          volume24h: ctx.dayNtlVlm?.toString() || '0',
        };

        // Add perps-specific data
        if (tradingType === 'perps' && 'funding' in ctx) {
          newStats.openInterest = ctx.openInterest?.toString() || '0';
          newStats.fundingRate = ctx.funding?.toString() || '0';
        }

        setStats(newStats);
      }
    },
  });

  return (
    <Card className="h-full p-4">
      <div className="grid h-full grid-cols-4 gap-4">
        <div>
          <Text className="text-muted-foreground text-xs">Price</Text>
          <Text className="font-semibold text-lg">
            {stats ? formatPrice(stats.markPrice) : '-'}
          </Text>
        </div>

        <div>
          <Text className="text-muted-foreground text-xs">24h Change</Text>
          <StatChange
            change={stats?.change24h || 0}
            className="font-semibold text-lg"
          >
            {stats?.change24h !== undefined
              ? `${stats.change24h.toFixed(2)}%`
              : '-'}
          </StatChange>
        </div>

        <div>
          <Text className="text-muted-foreground text-xs">24h Volume</Text>
          <Text className="font-semibold text-lg">
            {stats ? formatVolume(stats.volume24h) : '-'}
          </Text>
        </div>

        <div>
          <Text className="text-muted-foreground text-xs">
            {tradingType === 'perps' ? 'Open Interest' : 'Market Cap'}
          </Text>
          <Text className="font-semibold text-lg">
            {stats && tradingType === 'perps'
              ? formatVolume(stats.openInterest || '0')
              : '-'}
          </Text>
        </div>
      </div>

      {tradingType === 'perps' && stats?.fundingRate && (
        <div className="mt-2 border-t pt-2">
          <div className="flex items-center justify-between">
            <Text className="text-muted-foreground text-xs">Funding Rate</Text>
            <StatChange change={Number.parseFloat(stats.fundingRate) * 100}>
              {`${(Number.parseFloat(stats.fundingRate) * 100).toFixed(4)}%`}
            </StatChange>
          </div>
        </div>
      )}
    </Card>
  );
}
