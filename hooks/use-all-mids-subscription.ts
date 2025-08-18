'use client';

import type { AllMids } from '@/lib/websocket-schemas';
import { AllMidsSchema, SubAllMidsSchema } from '@/lib/websocket-schemas';
import { useSubscription } from './use-subscription';

type UseAllMidsSubscriptionOptions = {
  dex?: string;
  pause?: boolean;
  onResult: (data: AllMids) => void;
  onError?: (error: Error) => void;
};

export function useAllMidsSubscription({
  dex,
  pause = false,
  onResult,
  onError,
}: UseAllMidsSubscriptionOptions) {
  const subscriptionMessage = SubAllMidsSchema.parse({
    method: 'subscribe',
    subscription: {
      type: 'allMids',
      ...(dex && { dex }),
    },
  });

  return useSubscription({
    subscriptionMessage,
    responseSchema: AllMidsSchema,
    pause,
    onResult,
    onError,
  });
}
