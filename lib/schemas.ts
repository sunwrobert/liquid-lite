import { z } from 'zod';

export const UniverseItemSchema = z.object({
  szDecimals: z.number(),
  name: z.string(),
  maxLeverage: z.number(),
  marginTableId: z.number(),
  isDelisted: z.boolean().optional(),
});

export const AssetContextSchema = z.object({
  funding: z.string(),
  openInterest: z.string(),
  prevDayPx: z.string(),
  dayNtlVlm: z.string(),
  premium: z.string().nullable(),
  oraclePx: z.string(),
  markPx: z.string(),
  midPx: z.string().nullable(),
  impactPxs: z.array(z.string()).nullable(),
  dayBaseVlm: z.string(),
});

export const SpotTokenSchema = z.object({
  name: z.string(),
  szDecimals: z.number(),
  weiDecimals: z.number(),
  index: z.number(),
  tokenId: z.string(),
  isCanonical: z.boolean(),
  evmContract: z.unknown().nullable(), // Can be object or null
  fullName: z.string().nullable(),
  deployerTradingFeeShare: z.string(),
});

export const SpotUniverseItemSchema = z.object({
  name: z.string(),
  tokens: z.array(z.number()),
  index: z.number(),
  isCanonical: z.boolean(),
});

export const SpotAssetContextSchema = z.object({
  dayNtlVlm: z.string(),
  markPx: z.string(),
  midPx: z.string().nullable(),
  prevDayPx: z.string(),
  circulatingSupply: z.string(),
  coin: z.string(),
  totalSupply: z.string(),
  dayBaseVlm: z.string(),
});

export const MetaAndAssetCtxsResponseSchema = z.tuple([
  z.object({
    universe: z.array(UniverseItemSchema),
    marginTables: z.array(z.unknown()),
  }),
  z.array(AssetContextSchema),
]);

export const SpotMetaAndAssetCtxsResponseSchema = z.tuple([
  z.object({
    tokens: z.array(SpotTokenSchema),
    universe: z.array(SpotUniverseItemSchema),
  }),
  z.array(SpotAssetContextSchema),
]);

export type UniverseItem = z.infer<typeof UniverseItemSchema>;
export type SpotToken = z.infer<typeof SpotTokenSchema>;
export type SpotUniverseItem = z.infer<typeof SpotUniverseItemSchema>;
export type AssetContext = z.infer<typeof AssetContextSchema>;
export type SpotAssetContext = z.infer<typeof SpotAssetContextSchema>;
export type MetaAndAssetCtxsResponse = z.infer<
  typeof MetaAndAssetCtxsResponseSchema
>;
export type SpotMetaAndAssetCtxsResponse = z.infer<
  typeof SpotMetaAndAssetCtxsResponseSchema
>;
