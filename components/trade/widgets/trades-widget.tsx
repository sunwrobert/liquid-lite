'use client';

import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useTradesSubscription } from '@/hooks/use-trades-subscription';
import type { TradingType } from '@/lib/cookies/trade';
import { formatPrice, formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { WsTrade } from '@/lib/websocket-schemas';

type TradesWidgetProps = {
  asset: string;
  tradingType: TradingType;
};

type Trade = {
  id: string;
  side: 'buy' | 'sell';
  price: string;
  size: string;
  time: number;
};

export function TradesWidget({ asset, tradingType: _ }: TradesWidgetProps) {
  const [trades, setTrades] = useState<Trade[]>([]);

  const handleTradeUpdate = useCallback(
    (tradesData: WsTrade[]) => {
      const newTrades = tradesData
        .filter((trade) => trade.coin === asset)
        .map((trade) => ({
          id: `${trade.hash}-${trade.tid}`,
          side: trade.side === 'B' ? ('buy' as const) : ('sell' as const),
          price: trade.px,
          size: trade.sz,
          time: trade.time,
        }));

      setTrades((prev) => {
        const combined = [...newTrades, ...prev];
        // Keep only last 100 trades
        return combined.slice(0, 100);
      });
    },
    [asset]
  );

  const [isConnected, setIsConnected] = useState(false);

  useTradesSubscription({
    coin: asset,
    onResult: (data) => {
      setIsConnected(true);
      handleTradeUpdate(data);
    },
    onError: (_error) => {
      setIsConnected(false);
    },
  });

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <Text className="font-medium">Recent Trades</Text>
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            isConnected ? 'bg-success' : 'bg-error'
          )}
        />
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <div className="mb-2 grid grid-cols-4 gap-2 text-muted-foreground text-xs">
          <span>Time</span>
          <span>Side</span>
          <span>Price</span>
          <span>Size</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {trades.length === 0 ? (
            <Text className="py-8 text-center text-muted-foreground">
              No recent trades
            </Text>
          ) : (
            trades.map((trade) => (
              <div
                className={cn(
                  'grid grid-cols-4 gap-2 py-1 text-xs transition-colors',
                  trade.side === 'buy' ? 'bg-success/5' : 'bg-error/5'
                )}
                key={trade.id}
              >
                <span className="text-muted-foreground">
                  {formatTime(trade.time)}
                </span>
                <Badge
                  className={cn(
                    'text-xs',
                    trade.side === 'buy'
                      ? 'bg-success/20 text-success'
                      : 'bg-error/20 text-error'
                  )}
                >
                  {trade.side}
                </Badge>
                <span
                  className={cn(
                    'font-mono',
                    trade.side === 'buy' ? 'text-success' : 'text-error'
                  )}
                >
                  {formatPrice(trade.price)}
                </span>
                <span className="font-mono">
                  {Number.parseFloat(trade.size).toFixed(4)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
