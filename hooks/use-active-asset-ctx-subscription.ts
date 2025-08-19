'use client';

import type { z } from 'zod';
import { useSubscription } from '@/hooks/use-subscription';
import {
  SubActiveAssetCtxSchema,
  type WsActiveAssetCtxDataSchema,
  WsActiveAssetCtxSchema,
  type WsActiveSpotAssetCtxDataSchema,
} from '@/lib/websocket-schemas';

type UseActiveAssetCtxSubscriptionOptions = {
  coin: string;
  pause?: boolean;
  onResult: (
    data:
      | z.infer<typeof WsActiveAssetCtxDataSchema>
      | z.infer<typeof WsActiveSpotAssetCtxDataSchema>
  ) => void;
  onError?: (error: Error) => void;
};

export function useActiveAssetCtxSubscription({
  coin,
  pause = false,
  onResult,
  onError,
}: UseActiveAssetCtxSubscriptionOptions) {
  const subscriptionMessage = SubActiveAssetCtxSchema.parse({
    method: 'subscribe',
    subscription: {
      type: 'activeAssetCtx',
      coin,
    },
  });

  return useSubscription({
    subscriptionMessage,
    responseSchema: WsActiveAssetCtxSchema,
    pause,
    onResult: (message) => {
      // Extract the data from the message wrapper and pass it to onResult
      onResult(message.data);
    },
    onError,
  });
}
