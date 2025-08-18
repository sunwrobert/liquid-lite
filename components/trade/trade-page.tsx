'use client';

import { useEffect } from 'react';
import { setCookie } from 'react-use-cookie';
import { AssetPerpsToolbar } from '@/components/asset/asset-perps-toolbar';
import { AssetSpotToolbar } from '@/components/asset/asset-spot-toolbar';
import { AssetToolbar } from '@/components/asset/asset-toolbar';
import { TradeProvider } from '@/providers/trade-provider';

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
      <AssetToolbar asset={asset}>
        {tradingType === 'perps' ? (
          <AssetPerpsToolbar asset={asset} />
        ) : (
          <AssetSpotToolbar asset={asset} />
        )}
      </AssetToolbar>
    </TradeProvider>
  );
}
