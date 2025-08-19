'use client';

import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { useL2Book } from '@/hooks/use-l2-book';
import { useMetaAndAssetCtxs } from '@/hooks/use-meta-and-asset-ctxs';
import type { TradingType } from '@/lib/cookies/trade';
import {
  calculatePriceIncrements,
  formatPrice,
  formatVolume,
  priceIncrementToNSigFigs,
} from '@/lib/format';

type LiveOrderBookProps = {
  asset: string;
  tradingType: TradingType;
};

type OrderBookLevel = {
  price: number;
  sizeUsd: number;
  totalUsd: number;
  sizeAsset: number;
  totalAsset: number;
};

type DisplayMode = 'usd' | 'asset';

export function LiveOrderBook({ asset, tradingType }: LiveOrderBookProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('usd');
  const [priceIncrementIndex, setPriceIncrementIndex] = useState(3); // Default to 4th increment

  const pairedCoin = tradingType === 'perps' ? 'USD' : 'USDC';

  // Get asset context to determine current price
  const { data: metaData } = useMetaAndAssetCtxs({ asset });
  const assetContext = metaData?.assets[asset.toLowerCase()];
  const currentPrice = assetContext
    ? Number.parseFloat(assetContext.markPx)
    : 0;

  // Calculate dynamic price increments based on current price
  const priceIncrements = useMemo(
    () => calculatePriceIncrements(currentPrice),
    [currentPrice]
  );
  const selectedIncrement =
    priceIncrements[priceIncrementIndex] ?? priceIncrements[3] ?? 0.01;

  // Convert increment to API parameters
  const { nSigFigs, mantissa } = useMemo(
    () => priceIncrementToNSigFigs(selectedIncrement),
    [selectedIncrement]
  );

  // Use React Query hook to fetch and subscribe to order book data
  const { data: rawOrderBook } = useL2Book({
    coin: asset,
    nSigFigs,
    mantissa,
  });

  const orderBook = useMemo(() => {
    if (!rawOrderBook?.levels || rawOrderBook.levels.length < 2) {
      return { asks: [], bids: [], maxTotalUsd: 0 };
    }

    const [askLevels, bidLevels] = rawOrderBook.levels;
    const asks: OrderBookLevel[] = [];
    const bids: OrderBookLevel[] = [];
    let askTotalUsd = 0;
    let bidTotalUsd = 0;
    let askTotalAsset = 0;
    let bidTotalAsset = 0;

    // Process asks (sell orders) - sort by price descending (highest to lowest)
    const sortedAsks = [...askLevels].sort(
      (a, b) => Number.parseFloat(b.px) - Number.parseFloat(a.px)
    );
    for (const level of sortedAsks) {
      if (level?.px && level.sz) {
        const price = Number.parseFloat(level.px);
        const sizeAsset = Number.parseFloat(level.sz);
        const sizeUsd = price * sizeAsset;

        askTotalUsd += sizeUsd;
        askTotalAsset += sizeAsset;

        asks.push({
          price,
          sizeUsd,
          totalUsd: askTotalUsd,
          sizeAsset,
          totalAsset: askTotalAsset,
        });
      }
    }

    // Process bids (buy orders) - sort by price descending (highest to lowest)
    const sortedBids = [...bidLevels].sort(
      (a, b) => Number.parseFloat(b.px) - Number.parseFloat(a.px)
    );
    for (const level of sortedBids) {
      if (level?.px && level.sz) {
        const price = Number.parseFloat(level.px);
        const sizeAsset = Number.parseFloat(level.sz);
        const sizeUsd = price * sizeAsset;

        bidTotalUsd += sizeUsd;
        bidTotalAsset += sizeAsset;

        bids.push({
          price,
          sizeUsd,
          totalUsd: bidTotalUsd,
          sizeAsset,
          totalAsset: bidTotalAsset,
        });
      }
    }

    return {
      asks: asks.slice(0, 12),
      bids: bids.slice(0, 12),
      maxTotalUsd: Math.max(askTotalUsd, bidTotalUsd),
    };
  }, [rawOrderBook]);

  const spread = useMemo(() => {
    if (orderBook.asks.length > 0 && orderBook.bids.length > 0) {
      const lastAsk = orderBook.asks.at(-1)?.price;
      const firstBid = orderBook.bids[0]?.price;
      if (lastAsk !== undefined && firstBid !== undefined) {
        return lastAsk - firstBid;
      }
    }
    return 0;
  }, [orderBook]);

  const spreadPercent = useMemo(() => {
    if (spread > 0 && orderBook.bids.length > 0) {
      return (spread / (orderBook.bids[0]?.price ?? 1)) * 100;
    }
    return 0;
  }, [spread, orderBook.bids]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-8 items-center justify-between px-1">
        {/* Price Increment Selector */}
        <Select
          onValueChange={(value) =>
            setPriceIncrementIndex(Number.parseInt(value, 10))
          }
          value={priceIncrementIndex.toString()}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceIncrements.map((increment, index) => (
              <SelectItem key={increment} value={index.toString()}>
                {increment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Display Mode Toggle */}
        <Select
          onValueChange={(value: DisplayMode) => setDisplayMode(value)}
          value={displayMode}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">{pairedCoin}</SelectItem>
            <SelectItem value="asset">{asset}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Headers */}
      <div className="border-b px-3 py-2">
        <div className="grid grid-cols-3 gap-2 font-medium text-muted-foreground text-xs">
          <span>Price ({pairedCoin})</span>
          <span className="text-right">
            Size ({displayMode === 'usd' ? pairedCoin : asset})
          </span>
          <span className="text-right">
            Total ({displayMode === 'usd' ? pairedCoin : asset})
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          {/* Asks */}
          <div className="flex flex-col-reverse overflow-y-auto">
            {orderBook.asks.map((ask, index) => {
              const displaySize =
                displayMode === 'usd' ? ask.sizeUsd : ask.sizeAsset;
              const displayTotal =
                displayMode === 'usd' ? ask.totalUsd : ask.totalAsset;
              const maxTotal =
                displayMode === 'usd'
                  ? orderBook.maxTotalUsd
                  : Math.max(
                      ...orderBook.asks.map((a) => a.totalAsset),
                      ...orderBook.bids.map((b) => b.totalAsset)
                    );
              const fillPercentage =
                maxTotal > 0 ? (displaySize / maxTotal) * 100 : 0;

              return (
                <div
                  className="relative grid grid-cols-3 gap-2 px-3 py-1 text-xs hover:bg-muted/10"
                  key={`ask-${ask.price}-${index}`}
                  style={{
                    background: `linear-gradient(to left, hsl(var(--error) / ${Math.max(0.05, (fillPercentage / 100) * 0.3)}) ${fillPercentage}%, transparent ${fillPercentage}%)`,
                  }}
                >
                  <span className="relative z-10 text-error">
                    {formatPrice(ask.price)}
                  </span>
                  <span className="relative z-10 text-right">
                    {displayMode === 'usd'
                      ? formatVolume(displaySize)
                      : displaySize.toFixed(4)}
                  </span>
                  <span className="relative z-10 text-right">
                    {displayMode === 'usd'
                      ? formatVolume(displayTotal)
                      : displayTotal.toFixed(4)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Spread */}
          <div className="flex items-center justify-around border-y bg-border py-1">
            <Text className="text-foreground text-xs">Spread</Text>
            <Text className="text-foreground text-xs">
              {formatPrice(spread)}
            </Text>
            <Text className="text-foreground text-xs">
              {spreadPercent.toFixed(3)}%
            </Text>
          </div>

          {/* Bids */}
          <div className="overflow-y-auto">
            {orderBook.bids.map((bid, index) => {
              const displaySize =
                displayMode === 'usd' ? bid.sizeUsd : bid.sizeAsset;
              const displayTotal =
                displayMode === 'usd' ? bid.totalUsd : bid.totalAsset;
              const maxTotal =
                displayMode === 'usd'
                  ? orderBook.maxTotalUsd
                  : Math.max(
                      ...orderBook.asks.map((a) => a.totalAsset),
                      ...orderBook.bids.map((b) => b.totalAsset)
                    );
              const fillPercentage =
                maxTotal > 0 ? (displaySize / maxTotal) * 100 : 0;

              return (
                <div
                  className="relative grid grid-cols-3 gap-2 px-3 py-1 text-xs hover:bg-muted/10"
                  key={`bid-${bid.price}-${index}`}
                  style={{
                    background: `linear-gradient(to left, hsl(var(--success) / ${Math.max(0.05, (fillPercentage / 100) * 0.3)}) ${fillPercentage}%, transparent ${fillPercentage}%)`,
                  }}
                >
                  <span className="relative z-10 text-success">
                    {formatPrice(bid.price)}
                  </span>
                  <span className="relative z-10 text-right">
                    {displayMode === 'usd'
                      ? formatVolume(displaySize)
                      : displaySize.toFixed(4)}
                  </span>
                  <span className="relative z-10 text-right">
                    {displayMode === 'usd'
                      ? formatVolume(displayTotal)
                      : displayTotal.toFixed(4)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
