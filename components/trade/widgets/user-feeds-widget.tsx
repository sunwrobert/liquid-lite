'use client';

import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { useUserFillsSubscription } from '@/hooks/use-user-fills-subscription';
import type { TradingType } from '@/lib/cookies/trade';
import { formatPrice, formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { WsUserFills } from '@/lib/websocket-schemas';

type UserFeedsWidgetProps = {
  asset: string;
  tradingType: TradingType;
};

type FillData = {
  id: string;
  coin: string;
  side: 'buy' | 'sell';
  price: string;
  size: string;
  time: number;
  fee: string;
};

export function UserFeedsWidget({
  asset,
  tradingType: _,
}: UserFeedsWidgetProps) {
  const [fills, setFills] = useState<FillData[]>([]);
  const [_orders, _setOrders] = useState<unknown[]>([]);

  // Mock user address - in real app this would come from wallet connection
  const mockUser = '0x0000000000000000000000000000000000000000';

  const handleUserFills = useCallback(
    (data: WsUserFills) => {
      if (data.fills) {
        const newFills = data.fills
          .filter((fill) => fill.coin === asset)
          .map((fill) => ({
            id: `${fill.hash}-${fill.tid}`,
            coin: fill.coin,
            side: fill.side as 'buy' | 'sell',
            price: fill.px,
            size: fill.sz,
            time: fill.time,
            fee: fill.fee,
          }));

        setFills((prev) => {
          const combined = [...newFills, ...prev];
          // Keep only last 50 fills
          return combined.slice(0, 50);
        });
      }
    },
    [asset]
  );

  const [isConnected, setIsConnected] = useState(false);

  useUserFillsSubscription({
    user: mockUser,
    onResult: (data) => {
      setIsConnected(true);
      handleUserFills(data);
    },
    onError: (_error) => {
      setIsConnected(false);
    },
  });

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <Text className="font-medium">Trading Activity</Text>
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            isConnected ? 'bg-success' : 'bg-error'
          )}
        />
      </div>

      <Tabs className="flex flex-1 flex-col" defaultValue="fills">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="fills">Fills</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>

        <TabsContent className="flex-1 overflow-hidden p-4" value="fills">
          <div className="flex h-full flex-col">
            <div className="mb-2 grid grid-cols-5 gap-2 text-muted-foreground text-xs">
              <span>Time</span>
              <span>Side</span>
              <span>Price</span>
              <span>Size</span>
              <span>Fee</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {fills.length === 0 ? (
                <Text className="py-8 text-center text-muted-foreground">
                  No recent fills
                </Text>
              ) : (
                fills.map((fill) => (
                  <div
                    className="grid grid-cols-5 gap-2 py-1 text-xs"
                    key={fill.id}
                  >
                    <span>{formatTime(fill.time)}</span>
                    <Badge
                      className={cn(
                        'text-xs',
                        fill.side === 'buy'
                          ? 'bg-success/20 text-success'
                          : 'bg-error/20 text-error'
                      )}
                    >
                      {fill.side}
                    </Badge>
                    <span>{formatPrice(fill.price)}</span>
                    <span>{Number.parseFloat(fill.size).toFixed(4)}</span>
                    <span>{formatPrice(fill.fee)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent className="flex-1 p-4" value="orders">
          <Text className="py-8 text-center text-muted-foreground">
            No active orders
          </Text>
        </TabsContent>

        <TabsContent className="flex-1 p-4" value="positions">
          <Text className="py-8 text-center text-muted-foreground">
            No open positions
          </Text>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
