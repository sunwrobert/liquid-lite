'use client';

import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getL2Book } from '@/lib/api';
import type { L2BookData, WsBook } from '@/lib/websocket-schemas';
import { useL2BookSubscription } from './use-l2-book-subscription';

type UseL2BookOptions = {
  coin: string;
  nSigFigs?: number;
  mantissa?: number;
  queryOptions?: Partial<UseQueryOptions<L2BookData>>;
};

export function useL2Book({
  coin,
  nSigFigs,
  mantissa,
  queryOptions,
}: UseL2BookOptions) {
  const queryClient = useQueryClient();

  // Set up WebSocket subscription for real-time order book updates
  useL2BookSubscription({
    coin,
    nSigFigs,
    mantissa,
    pause: !coin,
    onResult: (data: WsBook) => {
      queryClient.setQueryData<L2BookData>(
        ['l2Book', coin, nSigFigs, mantissa],
        data.data
      );
    },
  });

  return useQuery<L2BookData>({
    queryKey: ['l2Book', coin, nSigFigs, mantissa],
    // biome-ignore lint/suspicious/useAwait: this is fine
    queryFn: async (): Promise<L2BookData> => {
      return getL2Book(coin, nSigFigs, mantissa);
    },
    enabled: !!coin,
    staleTime: Number.POSITIVE_INFINITY, // Never consider data stale since we have real-time updates
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // Disable periodic refetching
    ...queryOptions,
  });
}
