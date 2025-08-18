'use client';

import { z } from 'zod';
import type { WsTrade } from '@/lib/websocket-schemas';
import { SubTradesSchema, WsTradeSchema } from '@/lib/websocket-schemas';
import { useSubscription } from './use-subscription';

type UseTradesSubscriptionOptions = {
  coin: string;
  pause?: boolean;
  onResult: (data: WsTrade[]) => void;
  onError?: (error: Error) => void;
};

const TradesResponseSchema = z.array(WsTradeSchema);

export function useTradesSubscription({
  coin,
  pause = false,
  onResult,
  onError,
}: UseTradesSubscriptionOptions) {
  const subscriptionMessage = SubTradesSchema.parse({
    method: 'subscribe',
    subscription: {
      type: 'trades',
      coin,
    },
  });

  return useSubscription({
    subscriptionMessage,
    responseSchema: TradesResponseSchema,
    pause,
    onResult,
    onError,
  });
}
