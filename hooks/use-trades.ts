'use client';

import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useTradesSubscription } from '@/hooks/use-trades-subscription';
import type { WsTrade } from '@/lib/websocket-schemas';

type UseTradesOptions = {
  coin: string;
  queryOptions?: Partial<UseQueryOptions<WsTrade[]>>;
};

export function useTrades({ coin, queryOptions }: UseTradesOptions) {
  const queryClient = useQueryClient();

  // Set up WebSocket subscription for real-time trade updates
  useTradesSubscription({
    coin,
    pause: !coin,
    onResult: (trades: WsTrade[]) => {
      queryClient.setQueryData<WsTrade[]>(
        ['trades', coin],
        (previousTrades) => {
          const current = previousTrades ?? [];
          // Add new trades to the beginning and keep only latest 20
          return [...trades, ...current].slice(0, 20);
        }
      );
    },
  });

  return useQuery<WsTrade[]>({
    queryKey: ['trades', coin],
    queryFn: (): WsTrade[] => {
      // Return empty array as initial data
      return [];
    },
    enabled: !!coin,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    ...queryOptions,
  });
}
