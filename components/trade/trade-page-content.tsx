'use client';

import { Suspense } from 'react';
import { AssetPerpsToolbar } from '@/components/asset/asset-perps-toolbar';
import { AssetSpotToolbar } from '@/components/asset/asset-spot-toolbar';
import { AssetToolbar } from '@/components/asset/asset-toolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TradingType } from '@/lib/cookies/trade';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { LiveOrderBook } from './widgets/live-order-book';
import { TradesWidget } from './widgets/trades-widget';
import { TradingChart } from './widgets/trading-chart';

type TradePageContentProps = {
  asset: string;
  tradingType: TradingType;
};

export function TradePageContent({
  asset,
  tradingType,
}: TradePageContentProps) {
  return (
    <div className="grid h-full grid-cols-12 gap-1">
      {/* Left side - Asset toolbar and chart (7 columns) */}
      <div className="col-span-7 flex h-full flex-col gap-1">
        {/* Asset Toolbar */}
        <AssetToolbar>
          {tradingType === 'perps' ? (
            <AssetPerpsToolbar asset={asset} />
          ) : (
            <AssetSpotToolbar asset={asset} />
          )}
        </AssetToolbar>

        {/* Chart */}
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="h-full animate-pulse rounded-lg bg-muted" />
            }
          >
            <TradingChart asset={asset} tradingType={tradingType} />
          </Suspense>
        </div>
      </div>

      {/* Right side - Tabbed widgets (5 columns) */}
      <div className="col-span-5 h-full">
        <Card className="px-0">
          <Tabs className="flex h-full flex-col gap-0" defaultValue="orderbook">
            <div className="flex">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
              </TabsList>
              icon
            </div>

            <Separator className="-mt-[1px]" orientation="horizontal" />

            <TabsContent className="flex-1" value="orderbook">
              <Suspense
                fallback={
                  <div className="h-full animate-pulse rounded-lg bg-muted" />
                }
              >
                <LiveOrderBook asset={asset} tradingType={tradingType} />
              </Suspense>
            </TabsContent>

            <TabsContent className="flex-1" value="trades">
              <Suspense
                fallback={
                  <div className="h-full animate-pulse rounded-lg bg-muted" />
                }
              >
                <TradesWidget asset={asset} tradingType={tradingType} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
