'use client';

import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { keyBy } from 'es-toolkit';
import type { z } from 'zod';
import { getMetaAndAssetCtxs } from '@/lib/api';
import type { AssetContext, MetaAndAssetCtxsResponse } from '@/lib/schemas';
import type {
  WsActiveAssetCtxDataSchema,
  WsActiveSpotAssetCtxDataSchema,
} from '@/lib/websocket-schemas';
import { useActiveAssetCtxSubscription } from './use-active-asset-ctx-subscription';

const SECONDS_TO_MS = 1000;
const MARKET_DATA_REFRESH_SECONDS = 30;
const MARKET_DATA_STALE_TIME_MS = MARKET_DATA_REFRESH_SECONDS * SECONDS_TO_MS;
const MARKET_DATA_REFETCH_INTERVAL_MS =
  MARKET_DATA_REFRESH_SECONDS * SECONDS_TO_MS;

type UseMetaAndAssetCtxsOptions = {
  asset?: string;
  queryOptions?: Partial<UseQueryOptions<TransformedMetaAndAssetCtxs>>;
};

type TransformedMetaAndAssetCtxs = {
  assets: Record<
    string,
    AssetContext & { universeItem: MetaAndAssetCtxsResponse[0]['universe'][0] }
  >;
  universe: MetaAndAssetCtxsResponse[0]['universe'];
  marginTables: MetaAndAssetCtxsResponse[0]['marginTables'];
};

export function useMetaAndAssetCtxs({
  asset,
  queryOptions,
}: UseMetaAndAssetCtxsOptions = {}) {
  const queryClient = useQueryClient();

  // Set up WebSocket subscription for active asset real-time updates
  useActiveAssetCtxSubscription({
    coin: asset || '',
    pause: !asset,
    onResult: (
      data:
        | z.infer<typeof WsActiveAssetCtxDataSchema>
        | z.infer<typeof WsActiveSpotAssetCtxDataSchema>
    ) => {
      queryClient.setQueryData<TransformedMetaAndAssetCtxs>(
        ['metaAndAssetCtxs', asset],
        (oldData) => {
          if (!(oldData?.assets && data.coin)) {
            return oldData;
          }

          const coinKey = data.coin.toLowerCase();

          return {
            ...oldData,
            assets: {
              ...oldData.assets,
              [coinKey]: {
                ...oldData.assets[coinKey],
                ...data.ctx,
              },
            },
          };
        }
      );
    },
  });

  return useQuery<TransformedMetaAndAssetCtxs>({
    queryKey: ['metaAndAssetCtxs', asset],
    queryFn: async (): Promise<TransformedMetaAndAssetCtxs> => {
      const rawData = await getMetaAndAssetCtxs();
      const [meta, assetCtxs] = rawData;

      // Create combined data with universe items and their corresponding asset contexts
      const combinedAssetData = meta.universe.map((universeItem, index) => ({
        ...assetCtxs[index],
        universeItem,
      }));

      // Transform into object keyed by lowercase name
      const assets = keyBy(combinedAssetData, (item) =>
        item.universeItem.name.toLowerCase()
      );

      return {
        assets,
        universe: meta.universe,
        marginTables: meta.marginTables,
      };
    },
    staleTime: MARKET_DATA_STALE_TIME_MS,
    refetchInterval: MARKET_DATA_REFETCH_INTERVAL_MS,
    ...queryOptions,
  });
}
