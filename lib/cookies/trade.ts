import { cookies } from 'next/headers';
import { z } from 'zod';

const TradingTypeSchema = z.enum(['perps', 'spot']);
export type TradingType = z.infer<typeof TradingTypeSchema>;

const ChartIntervalSchema = z.enum([
  '1m',
  '3m',
  '5m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  '8h',
  '12h',
  '1d',
  '3d',
  '1w',
  '1M',
]);
export type CandleInterval = z.infer<typeof ChartIntervalSchema>;

const TradePreferencesSchema = z.object({
  asset: z.string().min(1),
  tradingType: TradingTypeSchema,
});
type TradePreferences = z.infer<typeof TradePreferencesSchema>;

const TradePreferencesStringSchema = z
  .string()
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid JSON' });
      return z.NEVER;
    }
  })
  .pipe(TradePreferencesSchema);

const TRADE_PREFERENCES_COOKIE = 'trade-preferences';
const CHART_INTERVAL_COOKIE = 'chart-interval';

const DEFAULT_TRADE_PREFERENCES: TradePreferences = {
  asset: 'ETH',
  tradingType: 'perps',
};

const DEFAULT_CHART_INTERVAL: CandleInterval = '1h';

export async function getTradePreferences(): Promise<TradePreferences> {
  const cookieStore = await cookies();
  const preferenceCookie = cookieStore.get(TRADE_PREFERENCES_COOKIE);

  if (!preferenceCookie) {
    return DEFAULT_TRADE_PREFERENCES;
  }

  const validated = TradePreferencesStringSchema.safeParse(
    preferenceCookie.value
  );
  return validated.success ? validated.data : DEFAULT_TRADE_PREFERENCES;
}

export async function getChartInterval(): Promise<CandleInterval> {
  const cookieStore = await cookies();
  const intervalCookie = cookieStore.get(CHART_INTERVAL_COOKIE);

  if (!intervalCookie) {
    return DEFAULT_CHART_INTERVAL;
  }

  const validated = ChartIntervalSchema.safeParse(intervalCookie.value);
  return validated.success ? validated.data : DEFAULT_CHART_INTERVAL;
}
