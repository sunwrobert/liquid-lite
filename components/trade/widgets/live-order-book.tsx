'use client';

import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { useL2Book } from '@/hooks/use-l2-book';
import { useMetaAndAssetCtxs } from '@/hooks/use-meta-and-asset-ctxs';
import type { TradingType } from '@/lib/cookies/trade';
import {
  calculatePriceIncrements,
  formatNumber,
  formatPrice,
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
    : null;

  // Calculate dynamic price increments based on current price (for display only)
  const priceIncrements = useMemo(
    () =>
      currentPrice !== null
        ? calculatePriceIncrements(currentPrice)
        : [0.01, 0.02, 0.05, 0.1, 1, 10],
    [currentPrice]
  );

  // Use React Query hook to fetch and subscribe to order book data
  const { data: rawOrderBook } = useL2Book({
    coin: asset,
  });

  const orderBook = useMemo(() => {
    if (!rawOrderBook?.levels || rawOrderBook.levels.length < 2) {
      return { asks: [], bids: [], maxTotalUsd: 0 };
    }

    const [bidLevels, askLevels] = rawOrderBook.levels;
    const asks: OrderBookLevel[] = [];
    const bids: OrderBookLevel[] = [];
    let askTotalUsd = 0;
    let bidTotalUsd = 0;
    let askTotalAsset = 0;
    let bidTotalAsset = 0;

    // Process asks (sell orders) - sort by price ascending (lowest to highest) since we reverse the display
    const sortedAsks = [...askLevels].sort(
      (a, b) => Number.parseFloat(a.px) - Number.parseFloat(b.px)
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

      <div className="flex-1 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Price ({pairedCoin})</TableHead>
              <TableHead className="justify-end text-right">
                Size ({displayMode === 'usd' ? pairedCoin : asset})
              </TableHead>
              <TableHead className="justify-end text-right">
                Total ({displayMode === 'usd' ? pairedCoin : asset})
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Asks */}
            {orderBook.asks
              .slice()
              .reverse()
              .map((ask, index) => {
                const displaySize =
                  displayMode === 'usd' ? ask.sizeUsd : ask.sizeAsset;
                const displayTotal =
                  displayMode === 'usd' ? ask.totalUsd : ask.totalAsset;

                // Calculate max size for proper percentage scaling
                const maxSize = Math.max(
                  ...orderBook.asks.map((a) =>
                    displayMode === 'usd' ? a.sizeUsd : a.sizeAsset
                  ),
                  ...orderBook.bids.map((b) =>
                    displayMode === 'usd' ? b.sizeUsd : b.sizeAsset
                  )
                );
                const fillPercentage =
                  maxSize > 0 ? (displaySize / maxSize) * 100 : 0;

                return (
                  <TableRow
                    className="relative hover:bg-muted/10"
                    key={`ask-${ask.price}-${index}`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-error/20"
                      style={{ width: `${fillPercentage}%` }}
                    />
                    <TableCell className="relative text-error">
                      {formatPrice(ask.price)}
                    </TableCell>
                    <TableCell className="relative justify-end text-right">
                      {formatNumber(displaySize, { display: 'standard' })}
                    </TableCell>
                    <TableCell className="relative justify-end text-right">
                      {formatNumber(displayTotal, { display: 'standard' })}
                    </TableCell>
                  </TableRow>
                );
              })}

            {/* Spread */}
            <div className="flex w-full justify-center gap-8 bg-border py-1">
              <Text className="text-foreground text-xs">Spread</Text>
              <Text className="text-foreground text-xs">
                {formatPrice(spread)}
              </Text>
              <Text className="text-foreground text-xs">
                {formatNumber(spreadPercent, { display: 'percent' })}
              </Text>
            </div>

            {/* Bids */}
            {orderBook.bids.map((bid, index) => {
              const displaySize =
                displayMode === 'usd' ? bid.sizeUsd : bid.sizeAsset;
              const displayTotal =
                displayMode === 'usd' ? bid.totalUsd : bid.totalAsset;
              const maxSize = Math.max(
                ...orderBook.asks.map((a) =>
                  displayMode === 'usd' ? a.sizeUsd : a.sizeAsset
                ),
                ...orderBook.bids.map((b) =>
                  displayMode === 'usd' ? b.sizeUsd : b.sizeAsset
                )
              );
              const fillPercentage =
                maxSize > 0 ? (displaySize / maxSize) * 100 : 0;

              return (
                <TableRow
                  className="relative hover:bg-muted/10"
                  key={`bid-${bid.price}-${index}`}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-success/20"
                    style={{ width: `${fillPercentage}%` }}
                  />
                  <TableCell className="relative text-success">
                    {formatPrice(bid.price)}
                  </TableCell>
                  <TableCell className="relative justify-end text-right">
                    {formatNumber(displaySize, { display: 'standard' })}
                  </TableCell>
                  <TableCell className="relative justify-end text-right">
                    {formatNumber(displayTotal, { display: 'standard' })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
