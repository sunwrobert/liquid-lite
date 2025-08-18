'use client';

import { useQuery } from '@tanstack/react-query';
import { getMetaAndAssetCtxs } from '@/lib/api';

const SECONDS_TO_MS = 1000;
const MARKET_DATA_REFRESH_SECONDS = 30;
const MARKET_DATA_STALE_TIME_MS = MARKET_DATA_REFRESH_SECONDS * SECONDS_TO_MS;
const MARKET_DATA_REFETCH_INTERVAL_MS =
  MARKET_DATA_REFRESH_SECONDS * SECONDS_TO_MS;

export function useMetaAndAssetCtxs() {
  return useQuery({
    queryKey: ['metaAndAssetCtxs'],
    queryFn: getMetaAndAssetCtxs,
    staleTime: MARKET_DATA_STALE_TIME_MS,
    refetchInterval: MARKET_DATA_REFETCH_INTERVAL_MS,
  });
}
