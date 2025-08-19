'use client';

import { z } from 'zod';
import { useSubscription } from '@/hooks/use-subscription';
import type { Candle } from '@/lib/websocket-schemas';
import { CandleSchema, SubCandleSchema } from '@/lib/websocket-schemas';

export type CandleInterval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M';

type UseCandleSubscriptionOptions = {
  coin: string;
  interval: CandleInterval;
  pause?: boolean;
  onResult: (data: Candle[]) => void;
  onError?: (error: Error) => void;
};

const WsCandleResponseSchema = z.object({
  channel: z.literal('candle'),
  data: CandleSchema,
});

export function useCandleSubscription({
  coin,
  interval,
  pause = false,
  onResult,
  onError,
}: UseCandleSubscriptionOptions) {
  const subscriptionMessage = SubCandleSchema.parse({
    method: 'subscribe',
    subscription: {
      type: 'candle',
      coin,
      interval,
    },
  });

  return useSubscription({
    subscriptionMessage,
    responseSchema: WsCandleResponseSchema,
    pause,
    onResult: (wsResponse) => onResult([wsResponse.data]),
    onError,
  });
}
