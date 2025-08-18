'use client';

import type { WsBbo } from '@/lib/websocket-schemas';
import { SubBboSchema, WsBboSchema } from '@/lib/websocket-schemas';
import { useSubscription } from './use-subscription';

type UseBboSubscriptionOptions = {
  coin: string;
  pause?: boolean;
  onResult: (data: WsBbo) => void;
  onError?: (error: Error) => void;
};

export function useBboSubscription({
  coin,
  pause = false,
  onResult,
  onError,
}: UseBboSubscriptionOptions) {
  const subscriptionMessage = SubBboSchema.parse({
    method: 'subscribe',
    subscription: {
      type: 'bbo',
      coin,
    },
  });

  return useSubscription({
    subscriptionMessage,
    responseSchema: WsBboSchema,
    pause,
    onResult,
    onError,
  });
}
