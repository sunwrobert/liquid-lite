'use client';

import { z } from 'zod';
import type { Candle } from '@/lib/websocket-schemas';
import { CandleSchema, SubCandleSchema } from '@/lib/websocket-schemas';
import { useSubscription } from './use-subscription';

type CandleInterval =
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

const CandleResponseSchema = z.array(CandleSchema);

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
    responseSchema: CandleResponseSchema,
    pause,
    onResult,
    onError,
  });
}
