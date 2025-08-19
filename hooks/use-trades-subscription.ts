'use client';

import { z } from 'zod';
import { useSubscription } from '@/hooks/use-subscription';
import type { WsTrade } from '@/lib/websocket-schemas';
import { SubTradesSchema, WsTradeSchema } from '@/lib/websocket-schemas';

type UseTradesSubscriptionOptions = {
  coin: string;
  pause?: boolean;
  onResult: (data: WsTrade[]) => void;
  onError?: (error: Error) => void;
};

const WsTradesResponseSchema = z.object({
  channel: z.literal('trades'),
  data: z.array(WsTradeSchema),
});

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
    responseSchema: WsTradesResponseSchema,
    pause,
    onResult: (wsResponse) => onResult(wsResponse.data),
    onError,
  });
}
