'use client';

import type { WsUserFills } from '@/lib/websocket-schemas';
import { SubUserFillsSchema, WsUserFillsSchema } from '@/lib/websocket-schemas';
import { useSubscription } from './use-subscription';

type UseUserFillsSubscriptionOptions = {
  user: string;
  aggregateByTime?: boolean;
  pause?: boolean;
  onResult: (data: WsUserFills) => void;
  onError?: (error: Error) => void;
};

export function useUserFillsSubscription({
  user,
  aggregateByTime,
  pause = false,
  onResult,
  onError,
}: UseUserFillsSubscriptionOptions) {
  const subscriptionMessage = SubUserFillsSchema.parse({
    method: 'subscribe',
    subscription: {
      type: 'userFills',
      user,
      ...(aggregateByTime !== undefined && { aggregateByTime }),
    },
  });

  return useSubscription({
    subscriptionMessage,
    responseSchema: WsUserFillsSchema,
    pause,
    onResult,
    onError,
  });
}
