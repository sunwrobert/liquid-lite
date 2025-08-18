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

export const MetaAndAssetCtxsResponseSchema = z.tuple([
  z.object({
    universe: z.array(UniverseItemSchema),
    marginTables: z.array(z.unknown()),
  }),
  z.array(AssetContextSchema),
]);

export type UniverseItem = z.infer<typeof UniverseItemSchema>;
export type AssetContext = z.infer<typeof AssetContextSchema>;
export type MetaAndAssetCtxsResponse = z.infer<
  typeof MetaAndAssetCtxsResponseSchema
>;
