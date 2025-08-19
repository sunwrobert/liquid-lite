'use client';

import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getCandleSnapshot } from '@/lib/api';
import type { Candle } from '@/lib/websocket-schemas';
import {
  type CandleInterval,
  useCandleSubscription,
} from './use-candle-subscription';

type UseCandleOptions = {
  coin: string;
  interval: CandleInterval;
  queryOptions?: Partial<UseQueryOptions<Candle[]>>;
};

export function useCandle({ coin, interval, queryOptions }: UseCandleOptions) {
  const queryClient = useQueryClient();

  // Set up WebSocket subscription for real-time candle updates
  useCandleSubscription({
    coin,
    interval,
    pause: !coin,
    onResult: (candles: Candle[]) => {
      queryClient.setQueryData<Candle[]>(
        ['candles', coin, interval],
        (previousCandles) => {
          const current = previousCandles ?? [];
          const updated = [...current];
          for (const newCandle of candles) {
            const existingIndex = updated.findIndex((c) => c.t === newCandle.t);
            if (existingIndex >= 0) {
              updated[existingIndex] = newCandle;
            } else {
              updated.push(newCandle);
            }
          }
          const result = updated.sort((a, b) => a.t - b.t);
          return result;
        }
      );
    },
  });

  return useQuery<Candle[]>({
    queryKey: ['candles', coin, interval],
    queryFn: async () => {
      // Calculate time range for most recent 2000 candles
      const now = Date.now();
      const intervalMs = getIntervalMs(interval);
      const maxCandles = 2000;

      // Generate start and end times based on the interval
      const startTime = now - maxCandles * intervalMs;
      const endTime = now;

      const result = await getCandleSnapshot(
        coin,
        interval,
        startTime,
        endTime
      );
      return result;
    },
    enabled: !!coin,
    staleTime: 30_000, // 30 seconds
    ...queryOptions,
  });
}

function getIntervalMs(interval: string): number {
  const intervalMap: Record<string, number> = {
    '1m': 60 * 1000,
    '3m': 3 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
  };
  return intervalMap[interval] ?? 60 * 1000;
}
