'use client';

import { useEffect } from 'react';
import { setCookie } from 'react-use-cookie';
import { TradeProvider } from '@/providers/trade-provider';
import { TradePageContent } from './trade-page-content';

type TradingType = 'perps' | 'spot';

type TradePageProps = {
  asset: string;
  tradingType: TradingType;
};

export function TradePage({ asset, tradingType }: TradePageProps) {
  // Set cookie when component mounts
  useEffect(() => {
    setCookie('trade-preferences', JSON.stringify({ asset, tradingType }));
  }, [asset, tradingType]);

  return (
    <TradeProvider asset={asset} tradingType={tradingType}>
      <div className="container mx-auto px-4">
        <h1 className="mb-6 font-bold text-2xl">
          {tradingType === 'spot'
            ? `${asset.toUpperCase()}/USDC Spot`
            : `${asset.toUpperCase()} Perpetuals`}
        </h1>
        <TradePageContent />
      </div>
    </TradeProvider>
  );
}
