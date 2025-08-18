'use client';

import { createContext, useContext } from 'react';

type TradingType = 'perps' | 'spot';

type TradeContextValue = {
  asset: string;
  tradingType: TradingType;
};

const TradeContext = createContext<TradeContextValue | null>(null);

export function useTrade() {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
}

type TradeProviderProps = {
  children: React.ReactNode;
  asset: string;
  tradingType: TradingType;
};

export function TradeProvider({ children, ...context }: TradeProviderProps) {
  return <TradeContext value={context}>{children}</TradeContext>;
}
