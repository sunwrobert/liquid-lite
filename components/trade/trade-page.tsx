'use client';

import { useEffect } from 'react';
import { setCookie } from 'react-use-cookie';
import type { CandleInterval, TradingType } from '@/lib/cookies/trade';
import { TradeProvider } from '@/providers/trade-provider';
import { TradePageContent } from './trade-page-content';

type TradePageProps = {
  asset: string;
  tradingType: TradingType;
  initialInterval: CandleInterval;
};

export function TradePage({
  asset,
  tradingType,
  initialInterval,
}: TradePageProps) {
  // Set cookie when component mounts
  useEffect(() => {
    setCookie('trade-preferences', JSON.stringify({ asset, tradingType }));
  }, [asset, tradingType]);

  return (
    <TradeProvider
      asset={asset}
      initialInterval={initialInterval}
      tradingType={tradingType}
    >
      <TradePageContent />
    </TradeProvider>
  );
}
