'use client';

import { MoreVerticalIcon } from 'lucide-react';
import { Suspense } from 'react';
import { AssetPerpsToolbar } from '@/components/asset/asset-perps-toolbar';
import { AssetSpotToolbar } from '@/components/asset/asset-spot-toolbar';
import { AssetToolbar } from '@/components/asset/asset-toolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTradeContext } from '@/providers/trade-provider';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { LiveOrderBook } from './widgets/live-order-book';
import { LiveTrades } from './widgets/live-trades';
import { TradingChart } from './widgets/trading-chart';

const CHART_HEIGHT = 568;

export function TradePageContent() {
  const { asset, tradingType, interval } = useTradeContext();
  return (
    <div className="grid h-full grid-cols-12 gap-1">
      {/* Left side - Asset toolbar and chart (7 columns) */}
      <div className="col-span-7 flex h-full flex-col gap-1">
        {/* Asset Toolbar */}
        <AssetToolbar>
          {tradingType === 'perps' ? (
            <AssetPerpsToolbar />
          ) : (
            <AssetSpotToolbar />
          )}
        </AssetToolbar>

        {/* Chart */}
        <div style={{ height: `${CHART_HEIGHT}px` }}>
          <Suspense
            fallback={
              <div className="h-full animate-pulse rounded-lg bg-muted" />
            }
          >
            <TradingChart key={`chart-${asset}-${tradingType}-${interval}`} />
          </Suspense>
        </div>
      </div>

      {/* Right side - Tabbed widgets (5 columns) */}
      <div className="col-span-5 h-full">
        <Card className="px-0 py-1" style={{ minHeight: `${CHART_HEIGHT}px` }}>
          <Tabs className="flex h-full flex-col gap-0" defaultValue="orderbook">
            <div className="flex">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
              </TabsList>
              <MoreVerticalIcon className="mt-2 mr-2 size-4 text-muted-foreground" />
            </div>

            <Separator className="-mt-[1px] mb-1" orientation="horizontal" />

            <TabsContent className="flex-1" value="orderbook">
              <Suspense
                fallback={
                  <div className="h-full animate-pulse rounded-lg bg-muted" />
                }
              >
                <LiveOrderBook />
              </Suspense>
            </TabsContent>

            <TabsContent className="flex-1" value="trades">
              <Suspense
                fallback={
                  <div className="h-full animate-pulse rounded-lg bg-muted" />
                }
              >
                <LiveTrades />
              </Suspense>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
