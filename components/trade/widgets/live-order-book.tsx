'use client';

import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useL2BookSubscription } from '@/hooks/use-l2-book-subscription';
import type { TradingType } from '@/lib/cookies/trade';
import { cn } from '@/lib/utils';
import type { WsBook } from '@/lib/websocket-schemas';

type LiveOrderBookProps = {
  asset: string;
  tradingType: TradingType;
};

type OrderBookLevel = {
  price: string;
  size: string;
  total: number;
};

export function LiveOrderBook({ asset }: LiveOrderBookProps) {
  const [orderBook, setOrderBook] = useState<{
    asks: OrderBookLevel[];
    bids: OrderBookLevel[];
    maxTotal: number;
  }>({ asks: [], bids: [], maxTotal: 0 });

  const handleOrderBookUpdate = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    (data: WsBook) => {
      if (data.coin !== asset) {
        return;
      }

      const asks: OrderBookLevel[] = [];
      const bids: OrderBookLevel[] = [];
      let askTotal = 0;
      let bidTotal = 0;

      // Process levels (assuming data.levels is [asks[], bids[]])
      if (data.levels && data.levels.length >= 2) {
        const [askLevels, bidLevels] = data.levels;

        // Process asks (sell orders)
        for (const level of askLevels) {
          if (level?.px && level.sz) {
            askTotal += Number.parseFloat(level.sz);
            asks.push({
              price: level.px,
              size: level.sz,
              total: askTotal,
            });
          }
        }

        // Process bids (buy orders)
        for (const level of bidLevels) {
          if (level?.px && level.sz) {
            bidTotal += Number.parseFloat(level.sz);
            bids.push({
              price: level.px,
              size: level.sz,
              total: bidTotal,
            });
          }
        }
      }

      const maxTotal = Math.max(askTotal, bidTotal);
      setOrderBook({
        asks: asks.slice(0, 10),
        bids: bids.slice(0, 10),
        maxTotal,
      });
    },
    [asset]
  );

  const [isConnected, setIsConnected] = useState(false);

  useL2BookSubscription({
    coin: asset,
    onResult: (data) => {
      setIsConnected(true);
      handleOrderBookUpdate(data);
    },
    onError: (_error) => {
      setIsConnected(false);
    },
  });

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <Text className="font-medium">Order Book</Text>
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            isConnected ? 'bg-success' : 'bg-error'
          )}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid h-full grid-rows-2">
          {/* Asks */}
          <div className="flex flex-col-reverse overflow-y-auto p-2">
            {orderBook.asks.map((ask, index) => (
              <div
                className="relative flex justify-between py-0.5 text-xs"
                key={`ask-${ask.price}-${index}`}
              >
                <div
                  className="absolute inset-0 bg-error/10"
                  style={{
                    width: `${(ask.total / orderBook.maxTotal) * 100}%`,
                  }}
                />
                <span className="relative z-10 text-error">
                  {Number.parseFloat(ask.price).toFixed(2)}
                </span>
                <span className="relative z-10">
                  {Number.parseFloat(ask.size).toFixed(4)}
                </span>
              </div>
            ))}
          </div>

          {/* Spread */}
          <div className="flex items-center justify-center border-y bg-muted/20 py-2">
            <Text className="text-muted-foreground text-xs">
              {orderBook.bids.length > 0 && orderBook.asks.length > 0
                ? `Spread: ${(
                    Number.parseFloat(orderBook.asks.at(-1)?.price || '0') -
                      Number.parseFloat(orderBook.bids[0]?.price || '0')
                  ).toFixed(2)}`
                : 'Connecting...'}
            </Text>
          </div>

          {/* Bids */}
          <div className="overflow-y-auto p-2">
            {orderBook.bids.map((bid, index) => (
              <div
                className="relative flex justify-between py-0.5 text-xs"
                key={`bid-${bid.price}-${index}`}
              >
                <div
                  className="absolute inset-0 bg-success/10"
                  style={{
                    width: `${(bid.total / orderBook.maxTotal) * 100}%`,
                  }}
                />
                <span className="relative z-10 text-success">
                  {Number.parseFloat(bid.price).toFixed(2)}
                </span>
                <span className="relative z-10">
                  {Number.parseFloat(bid.size).toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
