import { z } from 'zod';

// Base subscription request schema
const BaseSubscriptionSchema = z.object({
  method: z.literal('subscribe'),
  subscription: z.object({
    type: z.string(),
  }),
});

// Only keep the subscription schemas that are actually used
export const SubCandleSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('candle'),
    coin: z.string(),
    interval: z.enum([
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
    ]),
  }),
});

export const SubL2BookSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('l2Book'),
    coin: z.string(),
    nSigFigs: z.number().int().optional(),
    mantissa: z.number().int().optional(),
  }),
});

export const SubTradesSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('trades'),
    coin: z.string(),
  }),
});

export const SubActiveAssetCtxSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('activeAssetCtx'),
    coin: z.string(),
  }),
});

// Response data schemas that are actually used
const WsLevelSchema = z.object({
  px: z.string(),
  sz: z.string(),
  n: z.number().int(),
});

export const WsTradeSchema = z.object({
  coin: z.string(),
  side: z.string(),
  px: z.string(),
  sz: z.string(),
  hash: z.string(),
  time: z.number().int(),
  tid: z.number().int(),
  users: z.array(z.string()).min(2).max(2),
});

export const CandleSchema = z.object({
  t: z.number().int(),
  T: z.number().int(),
  s: z.string(),
  i: z.string(),
  o: z.coerce.number(),
  c: z.coerce.number(),
  h: z.coerce.number(),
  l: z.coerce.number(),
  v: z.coerce.number(),
  n: z.number().int(),
});

// L2 Book data schema (the actual book data)
export const L2BookDataSchema = z.object({
  coin: z.string(),
  levels: z.array(z.array(WsLevelSchema)),
  time: z.number().int(),
});

// L2 Book websocket message schema (includes channel wrapper)
export const WsBookSchema = z.object({
  channel: z.literal('l2Book'),
  data: L2BookDataSchema,
});

// Unified schemas that match API data format (strings)
const SharedAssetCtxBaseSchema = z.object({
  dayNtlVlm: z.string(),
  prevDayPx: z.string(),
  markPx: z.string(),
  midPx: z.string(),
  premium: z.string().nullable().optional(),
  impactPxs: z.array(z.string()).nullable().optional(),
  dayBaseVlm: z.string().optional(),
});

const PerpsAssetCtxBaseSchema = SharedAssetCtxBaseSchema.extend({
  funding: z.string(),
  openInterest: z.string(),
  oraclePx: z.string(),
});

const SpotAssetCtxBaseSchema = SharedAssetCtxBaseSchema.extend({
  circulatingSupply: z.string(),
});

// For backward compatibility, keep the original names
const PerpsAssetCtxSchema = PerpsAssetCtxBaseSchema;
const SpotAssetCtxSchema = SpotAssetCtxBaseSchema;

// ActiveAssetCtx response schemas
export const WsActiveAssetCtxDataSchema = z.object({
  coin: z.string(),
  ctx: PerpsAssetCtxSchema,
});

export const WsActiveSpotAssetCtxDataSchema = z.object({
  coin: z.string(),
  ctx: SpotAssetCtxSchema,
});

export const WsActiveAssetCtxSchema = z.object({
  channel: z.literal('activeAssetCtx'),
  data: z.union([WsActiveAssetCtxDataSchema, WsActiveSpotAssetCtxDataSchema]),
});

export type Candle = z.infer<typeof CandleSchema>;
export type L2BookData = z.infer<typeof L2BookDataSchema>;
export type WsBook = z.infer<typeof WsBookSchema>;
export type WsTrade = z.infer<typeof WsTradeSchema>;
export type WsActiveAssetCtxDataSchema = typeof WsActiveAssetCtxDataSchema;
export type WsActiveSpotAssetCtxDataSchema =
  typeof WsActiveSpotAssetCtxDataSchema;
