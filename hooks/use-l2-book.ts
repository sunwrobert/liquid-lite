'use client';

import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getL2Book } from '@/lib/api';
import type { WsBook } from '@/lib/websocket-schemas';
import { useL2BookSubscription } from './use-l2-book-subscription';

const SECONDS_TO_MS = 1000;
const ORDER_BOOK_REFRESH_SECONDS = 1;
const ORDER_BOOK_STALE_TIME_MS = ORDER_BOOK_REFRESH_SECONDS * SECONDS_TO_MS;
const ORDER_BOOK_REFETCH_INTERVAL_MS =
  ORDER_BOOK_REFRESH_SECONDS * SECONDS_TO_MS;

type UseL2BookOptions = {
  coin: string;
  nSigFigs?: number;
  mantissa?: number;
  queryOptions?: Partial<UseQueryOptions<WsBook>>;
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
      queryClient.setQueryData<WsBook>(
        ['l2Book', coin, nSigFigs, mantissa],
        data
      );
    },
  });

  return useQuery<WsBook>({
    queryKey: ['l2Book', coin, nSigFigs, mantissa],
    // biome-ignore lint/suspicious/useAwait: this is fine
    queryFn: async (): Promise<WsBook> => {
      return getL2Book(coin, nSigFigs, mantissa);
    },
    enabled: !!coin,
    staleTime: ORDER_BOOK_STALE_TIME_MS,
    refetchInterval: ORDER_BOOK_REFETCH_INTERVAL_MS,
    ...queryOptions,
  });
}
