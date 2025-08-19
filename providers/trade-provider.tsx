'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import useCookie from 'react-use-cookie';
import { z } from 'zod';
import type { CandleInterval } from '@/hooks/use-candle-subscription';
import type { TradingType } from '@/lib/cookies/trade';

const ChartIntervalSchema = z.enum([
  '1m',
  '3m',
  '5m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  '8h',
  '12h',
  '1d',
  '3d',
  '1w',
  '1M',
]);

const CHART_INTERVAL_COOKIE = 'chart-interval';

const TradeContext = createContext<{
  asset: string;
  tradingType: TradingType;
  interval: CandleInterval;
  setInterval: (interval: CandleInterval) => void;
}>({
  asset: 'ETH',
  tradingType: 'perps',
  interval: '1h',
  setInterval: () => {
    // Default no-op implementation
  },
});

type TradeProviderProps = {
  children: React.ReactNode;
  asset: string;
  tradingType: TradingType;
  initialInterval: CandleInterval;
};

export function TradeProvider({
  children,
  asset,
  tradingType,
  initialInterval,
}: TradeProviderProps) {
  const [intervalCookie, setIntervalCookie] = useCookie(CHART_INTERVAL_COOKIE);
  const parsed = ChartIntervalSchema.safeParse(intervalCookie);
  const resolvedInterval = parsed.success ? parsed.data : initialInterval;

  const setInterval = useCallback(
    (next: CandleInterval) => {
      setIntervalCookie(next, { days: 3650, path: '/' });
    },
    [setIntervalCookie]
  );

  const value = useMemo(
    () => ({
      asset,
      tradingType,
      interval: resolvedInterval,
      setInterval,
    }),
    [asset, tradingType, resolvedInterval, setInterval]
  );

  return (
    <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
  );
}

export const useTradeContext = () => useContext(TradeContext);
