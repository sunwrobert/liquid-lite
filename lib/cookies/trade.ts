import { cookies } from 'next/headers';
import { z } from 'zod';

const TradingTypeSchema = z.enum(['perps', 'spot']);
export type TradingType = z.infer<typeof TradingTypeSchema>;

const TradePreferencesSchema = z.object({
  asset: z.string().min(1),
  tradingType: TradingTypeSchema,
});
export type TradePreferences = z.infer<typeof TradePreferencesSchema>;

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

export const DEFAULT_TRADE_PREFERENCES: TradePreferences = {
  asset: 'BTC',
  tradingType: 'perps',
};

const COOKIE_MAX_AGE = Number.MAX_SAFE_INTEGER; // Effectively forever

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

export async function setTradePreferences(
  preferences: TradePreferences
): Promise<void> {
  const validated = TradePreferencesSchema.parse(preferences);

  const cookieStore = await cookies();
  cookieStore.set(TRADE_PREFERENCES_COOKIE, JSON.stringify(validated), {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: false, // Allow client-side access if needed
    sameSite: 'lax',
    path: '/',
  });
}
