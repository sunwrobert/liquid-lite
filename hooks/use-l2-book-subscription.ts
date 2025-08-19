'use client';

import { useSubscription } from '@/hooks/use-subscription';
import type { WsBook } from '@/lib/websocket-schemas';
import { SubL2BookSchema, WsBookSchema } from '@/lib/websocket-schemas';

type UseL2BookSubscriptionOptions = {
  coin: string;
  nSigFigs?: number;
  mantissa?: number;
  pause?: boolean;
  onResult: (data: WsBook) => void;
  onError?: (error: Error) => void;
};

export function useL2BookSubscription({
  coin,
  nSigFigs,
  mantissa,
  pause = false,
  onResult,
  onError,
}: UseL2BookSubscriptionOptions) {
  const subscriptionMessage = SubL2BookSchema.parse({
    method: 'subscribe',
    subscription: {
      type: 'l2Book',
      coin,
      ...(nSigFigs !== undefined && { nSigFigs }),
      ...(mantissa !== undefined && { mantissa }),
    },
  });

  return useSubscription({
    subscriptionMessage,
    responseSchema: WsBookSchema,
    pause,
    onResult,
    onError,
  });
}
