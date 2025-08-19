'use client';

import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { keyBy } from 'es-toolkit';
import type { z } from 'zod';
import { useActiveAssetCtxSubscription } from '@/hooks/use-active-asset-ctx-subscription';
import { getSpotMetaAndAssetCtxs } from '@/lib/api';
import type {
  SpotAssetContext,
  SpotMetaAndAssetCtxsResponse,
} from '@/lib/schemas';
import type {
  WsActiveAssetCtxDataSchema,
  WsActiveSpotAssetCtxDataSchema,
} from '@/lib/websocket-schemas';

const SECONDS_TO_MS = 1000;
const MARKET_DATA_REFRESH_SECONDS = 30;
const MARKET_DATA_STALE_TIME_MS = MARKET_DATA_REFRESH_SECONDS * SECONDS_TO_MS;
const MARKET_DATA_REFETCH_INTERVAL_MS =
  MARKET_DATA_REFRESH_SECONDS * SECONDS_TO_MS;

type UseSpotMetaAndAssetCtxsOptions = {
  asset?: string;
  queryOptions?: Partial<UseQueryOptions<TransformedSpotMetaAndAssetCtxs>>;
};

type TransformedSpotMetaAndAssetCtxs = {
  assets: Record<
    string,
    SpotAssetContext & {
      universeItem: SpotMetaAndAssetCtxsResponse[0]['universe'][0];
    }
  >;
  universe: SpotMetaAndAssetCtxsResponse[0]['universe'];
  tokens: SpotMetaAndAssetCtxsResponse[0]['tokens'];
};

/**
 * Hook that fetches spot asset metadata only.
 * Spot assets don't have funding rates or leverage.
 */
export function useSpotMetaAndAssetCtxs({
  asset,
  queryOptions,
}: UseSpotMetaAndAssetCtxsOptions = {}) {
  const queryClient = useQueryClient();

  useActiveAssetCtxSubscription({
    coin: asset || '',
    pause: !asset,
    onResult: (
      data:
        | z.infer<typeof WsActiveAssetCtxDataSchema>
        | z.infer<typeof WsActiveSpotAssetCtxDataSchema>
    ) => {
      queryClient.setQueryData<TransformedSpotMetaAndAssetCtxs>(
        ['spotMetaAndAssetCtxs', asset],
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

  return useQuery<TransformedSpotMetaAndAssetCtxs>({
    queryKey: ['spotMetaAndAssetCtxs'],
    queryFn: async (): Promise<TransformedSpotMetaAndAssetCtxs> => {
      const rawData = await getSpotMetaAndAssetCtxs();
      const [meta, assetCtxs] = rawData;

      // Create a token lookup map for quick access by index
      const tokenLookup = new Map(
        meta.tokens.map((token) => [token.index, token.name])
      );

      // Create combined data with universe items and their corresponding asset contexts
      // Also transform "@X" names to proper token pair names
      const combinedAssetData = meta.universe.map((universeItem, index) => {
        let displayName = universeItem.name;

        // If name starts with "@" and we have token indices, create proper symbol
        if (
          universeItem.name.startsWith('@') &&
          universeItem.tokens.length >= 2
        ) {
          const [baseTokenIndex, quoteTokenIndex] = universeItem.tokens;
          const baseToken = tokenLookup.get(baseTokenIndex);
          const quoteToken = tokenLookup.get(quoteTokenIndex);

          if (baseToken && quoteToken) {
            displayName = `${baseToken}/${quoteToken}`;
          }
        }

        return {
          ...assetCtxs[index],
          universeItem: {
            ...universeItem,
            name: displayName, // Override the name with proper display name
          },
        };
      });

      // Transform into object keyed by lowercase display name
      const assets = keyBy(
        combinedAssetData,
        (
          item: SpotAssetContext & {
            universeItem: SpotMetaAndAssetCtxsResponse[0]['universe'][0];
          }
        ) => item.universeItem.name.toLowerCase()
      );

      // Also update the universe array with display names
      const updatedUniverse = meta.universe.map((universeItem) => {
        let displayName = universeItem.name;

        if (
          universeItem.name.startsWith('@') &&
          universeItem.tokens.length >= 2
        ) {
          const [baseTokenIndex, quoteTokenIndex] = universeItem.tokens;
          const baseToken = tokenLookup.get(baseTokenIndex);
          const quoteToken = tokenLookup.get(quoteTokenIndex);

          if (baseToken && quoteToken) {
            displayName = `${baseToken}/${quoteToken}`;
          }
        }

        return {
          ...universeItem,
          name: displayName,
        };
      });

      return {
        assets,
        universe: updatedUniverse,
        tokens: meta.tokens,
      };
    },
    staleTime: MARKET_DATA_STALE_TIME_MS,
    refetchInterval: MARKET_DATA_REFETCH_INTERVAL_MS,
    ...queryOptions,
  });
}
