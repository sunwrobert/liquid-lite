import { z } from 'zod';

// Base subscription request schema
const BaseSubscriptionSchema = z.object({
  method: z.literal('subscribe'),
  subscription: z.object({
    type: z.string(),
  }),
});

// Subscription request schemas
export const SubAllMidsSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('allMids'),
    dex: z.string().optional(),
  }),
});

export const SubNotificationSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('notification'),
    user: z.string(),
  }),
});

export const SubWebData2Schema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('webData2'),
    user: z.string(),
  }),
});

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

export const SubOrderUpdatesSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('orderUpdates'),
    user: z.string(),
  }),
});

export const SubUserEventsSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('userEvents'),
    user: z.string(),
  }),
});

export const SubUserFillsSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('userFills'),
    user: z.string(),
    aggregateByTime: z.boolean().optional(),
  }),
});

export const SubUserFundingsSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('userFundings'),
    user: z.string(),
  }),
});

export const SubUserNonFundingLedgerUpdatesSchema =
  BaseSubscriptionSchema.extend({
    subscription: z.object({
      type: z.literal('userNonFundingLedgerUpdates'),
      user: z.string(),
    }),
  });

export const SubActiveAssetCtxSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('activeAssetCtx'),
    coin: z.string(),
  }),
});

export const SubActiveAssetDataSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('activeAssetData'),
    user: z.string(),
    coin: z.string(),
  }),
});

export const SubUserTwapSliceFillsSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('userTwapSliceFills'),
    user: z.string(),
  }),
});

export const SubUserTwapHistorySchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('userTwapHistory'),
    user: z.string(),
  }),
});

export const SubBboSchema = BaseSubscriptionSchema.extend({
  subscription: z.object({
    type: z.literal('bbo'),
    coin: z.string(),
  }),
});

// Response data schemas
export const WsLevelSchema = z.object({
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

export const FillLiquidationSchema = z.object({
  liquidatedUser: z.string(),
  markPx: z.number(),
  method: z.enum(['market', 'backstop']),
});

export const WsFillSchema = z.object({
  coin: z.string(),
  px: z.string(),
  sz: z.string(),
  side: z.string(),
  time: z.number().int(),
  startPosition: z.string(),
  dir: z.string(),
  closedPnl: z.string(),
  hash: z.string(),
  oid: z.number().int(),
  crossed: z.boolean(),
  fee: z.string(),
  tid: z.number().int(),
  liquidation: FillLiquidationSchema.nullable(),
  feeToken: z.string(),
  builderFee: z.string(),
});

export const WsBasicOrderSchema = z.object({
  coin: z.string(),
  side: z.string(),
  limitPx: z.string(),
  sz: z.string(),
  oid: z.number().int(),
  timestamp: z.number().int(),
  origSz: z.string(),
  cloid: z.string(),
});

export const WsOrderSchema = z.object({
  order: WsBasicOrderSchema,
  status: z.string(),
  statusTimestamp: z.number().int(),
});

export const WsUserFundingSchema = z.object({
  time: z.number().int(),
  coin: z.string(),
  usdc: z.string(),
  szi: z.string(),
  fundingRate: z.string(),
});

export const WsLiquidationSchema = z.object({
  lid: z.number().int(),
  liquidator: z.string(),
  liquidated_user: z.string(),
  liquidated_ntl_pos: z.string(),
  liquidated_account_value: z.string(),
});

export const WsNonUserCancelSchema = z.object({
  coin: z.string(),
  oid: z.number().int(),
});

// Unified schemas that match API data format (strings)
// WebSocket already sends these as strings, so no transformation needed
export const SharedAssetCtxBaseSchema = z.object({
  dayNtlVlm: z.string(),
  prevDayPx: z.string(),
  markPx: z.string(),
  midPx: z.string(),
  premium: z.string().nullable().optional(),
  impactPxs: z.array(z.string()).nullable().optional(),
  dayBaseVlm: z.string().optional(),
});

export const PerpsAssetCtxBaseSchema = SharedAssetCtxBaseSchema.extend({
  funding: z.string(),
  openInterest: z.string(),
  oraclePx: z.string(),
});

export const SpotAssetCtxBaseSchema = SharedAssetCtxBaseSchema.extend({
  circulatingSupply: z.string(),
});

// For backward compatibility, keep the original names
export const SharedAssetCtxSchema = SharedAssetCtxBaseSchema;
export const PerpsAssetCtxSchema = PerpsAssetCtxBaseSchema;
export const SpotAssetCtxSchema = SpotAssetCtxBaseSchema;

export const TwapStateSchema = z.object({
  coin: z.string(),
  user: z.string(),
  side: z.string(),
  sz: z.number(),
  executedSz: z.number(),
  executedNtl: z.number(),
  minutes: z.number(),
  reduceOnly: z.boolean(),
  randomize: z.boolean(),
  timestamp: z.number(),
});

export const TwapStatusSchema = z.enum([
  'activated',
  'terminated',
  'finished',
  'error',
]);

export const WsTwapSliceFillSchema = z.object({
  fill: WsFillSchema,
  twapId: z.number().int(),
});

export const WsTwapHistorySchema = z.object({
  state: TwapStateSchema,
  status: z.object({
    status: TwapStatusSchema,
    description: z.string(),
  }),
  time: z.number().int(),
});

// Published data schemas
export const AllMidsSchema = z.object({
  mids: z.record(z.string(), z.string()),
});

export const NotificationSchema = z.object({
  notification: z.string(),
});

export const WebData2Schema = z.record(z.string(), z.unknown());

export const CandleSchema = z.object({
  t: z.number().int(),
  T: z.number().int(),
  s: z.string(),
  i: z.string(),
  o: z.number(),
  c: z.number(),
  h: z.number(),
  l: z.number(),
  v: z.number(),
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

export const WsUserEventSchema = z.union([
  z.object({
    fills: z.array(WsFillSchema),
  }),
  z.object({
    funding: WsUserFundingSchema,
  }),
  z.object({
    liquidation: WsLiquidationSchema,
  }),
  z.object({
    nonUserCancel: z.array(WsNonUserCancelSchema),
  }),
]);

export const WsUserFillsSchema = z.object({
  isSnapshot: z.boolean(),
  user: z.string(),
  fills: z.array(WsFillSchema),
});

export const WsUserFundingsSchema = z.object({
  isSnapshot: z.boolean(),
  user: z.string(),
  fundings: z.array(WsUserFundingSchema),
});

// Ledger update schemas
export const WsDepositSchema = z.object({
  type: z.literal('deposit'),
  usdc: z.number(),
});

export const WsWithdrawSchema = z.object({
  type: z.literal('withdraw'),
  usdc: z.number(),
  nonce: z.number(),
  fee: z.number(),
});

export const WsInternalTransferSchema = z.object({
  type: z.literal('internalTransfer'),
  usdc: z.number(),
  user: z.string(),
  destination: z.string(),
  fee: z.number(),
});

export const WsSubAccountTransferSchema = z.object({
  type: z.literal('subAccountTransfer'),
  usdc: z.number(),
  user: z.string(),
  destination: z.string(),
});

export const LiquidatedPositionSchema = z.object({
  coin: z.string(),
  szi: z.number(),
});

export const WsLedgerLiquidationSchema = z.object({
  type: z.literal('liquidation'),
  accountValue: z.number(),
  leverageType: z.enum(['Cross', 'Isolated']),
  liquidatedPositions: z.array(LiquidatedPositionSchema),
});

export const WsVaultDeltaSchema = z.object({
  type: z.enum(['vaultCreate', 'vaultDeposit', 'vaultDistribution']),
  vault: z.string(),
  usdc: z.number(),
});

export const WsVaultWithdrawalSchema = z.object({
  type: z.literal('vaultWithdraw'),
  vault: z.string(),
  user: z.string(),
  requestedUsd: z.number(),
  commission: z.number(),
  closingCost: z.number(),
  basis: z.number(),
  netWithdrawnUsd: z.number(),
});

export const WsVaultLeaderCommissionSchema = z.object({
  type: z.literal('vaultLeaderCommission'),
  user: z.string(),
  usdc: z.number(),
});

export const WsSpotTransferSchema = z.object({
  type: z.literal('spotTransfer'),
  token: z.string(),
  amount: z.number(),
  usdcValue: z.number(),
  user: z.string(),
  destination: z.string(),
  fee: z.number(),
});

export const WsAccountClassTransferSchema = z.object({
  type: z.literal('accountClassTransfer'),
  usdc: z.number(),
  toPerp: z.boolean(),
});

export const WsSpotGenesisSchema = z.object({
  type: z.literal('spotGenesis'),
  token: z.string(),
  amount: z.number(),
});

export const WsRewardsClaimSchema = z.object({
  type: z.literal('rewardsClaim'),
  amount: z.number(),
});

export const WsLedgerUpdateSchema = z.union([
  WsDepositSchema,
  WsWithdrawSchema,
  WsInternalTransferSchema,
  WsSubAccountTransferSchema,
  WsLedgerLiquidationSchema,
  WsVaultDeltaSchema,
  WsVaultWithdrawalSchema,
  WsVaultLeaderCommissionSchema,
  WsSpotTransferSchema,
  WsAccountClassTransferSchema,
  WsSpotGenesisSchema,
  WsRewardsClaimSchema,
]);

export const WsUserNonFundingLedgerUpdateSchema = z.object({
  time: z.number(),
  hash: z.string(),
  delta: WsLedgerUpdateSchema,
});

export const WsUserNonFundingLedgerUpdatesSchema = z.object({
  isSnapshot: z.boolean(),
  user: z.string(),
  updates: z.array(WsUserNonFundingLedgerUpdateSchema),
});

// Base message wrapper for all WebSocket messages
export const WsMessageSchema = z.object({
  channel: z.string(),
  data: z.unknown(),
});

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

export const WsActiveSpotAssetCtxSchema = z.object({
  channel: z.literal('activeAssetCtx'),
  data: WsActiveSpotAssetCtxDataSchema,
});

export const WsActiveAssetDataSchema = z.object({
  user: z.string(),
  coin: z.string(),
  leverage: z.object({
    type: z.string(),
    value: z.number().int(),
  }),
  maxTradeSzs: z.array(z.number()).min(2).max(2),
  availableToTrade: z.array(z.number()).min(2).max(2),
});

export const WsUserTwapSliceFillsSchema = z.object({
  isSnapshot: z.boolean(),
  user: z.string(),
  twapSliceFills: z.array(WsTwapSliceFillSchema),
});

export const WsUserTwapHistorySchema = z.object({
  isSnapshot: z.boolean(),
  user: z.string(),
  history: z.array(WsTwapHistorySchema),
});

export const WsBboSchema = z.object({
  coin: z.string(),
  time: z.number().int(),
  bbo: z.array(z.union([WsLevelSchema, z.null()])),
});

// Type exports
export type SubAllMids = z.infer<typeof SubAllMidsSchema>;
export type SubNotification = z.infer<typeof SubNotificationSchema>;
export type SubWebData2 = z.infer<typeof SubWebData2Schema>;
export type SubCandle = z.infer<typeof SubCandleSchema>;
export type SubL2Book = z.infer<typeof SubL2BookSchema>;
export type SubTrades = z.infer<typeof SubTradesSchema>;
export type SubOrderUpdates = z.infer<typeof SubOrderUpdatesSchema>;
export type SubUserEvents = z.infer<typeof SubUserEventsSchema>;
export type SubUserFills = z.infer<typeof SubUserFillsSchema>;
export type SubUserFundings = z.infer<typeof SubUserFundingsSchema>;
export type SubUserNonFundingLedgerUpdates = z.infer<
  typeof SubUserNonFundingLedgerUpdatesSchema
>;
export type SubActiveAssetCtx = z.infer<typeof SubActiveAssetCtxSchema>;
export type SubActiveAssetData = z.infer<typeof SubActiveAssetDataSchema>;
export type SubUserTwapSliceFills = z.infer<typeof SubUserTwapSliceFillsSchema>;
export type SubUserTwapHistory = z.infer<typeof SubUserTwapHistorySchema>;
export type SubBbo = z.infer<typeof SubBboSchema>;

export type WsLevel = z.infer<typeof WsLevelSchema>;
export type WsTrade = z.infer<typeof WsTradeSchema>;
export type WsFill = z.infer<typeof WsFillSchema>;
export type WsBasicOrder = z.infer<typeof WsBasicOrderSchema>;
export type WsOrder = z.infer<typeof WsOrderSchema>;
export type WsUserFunding = z.infer<typeof WsUserFundingSchema>;
export type WsLiquidation = z.infer<typeof WsLiquidationSchema>;
export type WsNonUserCancel = z.infer<typeof WsNonUserCancelSchema>;
export type SharedAssetCtx = z.infer<typeof SharedAssetCtxSchema>;
export type PerpsAssetCtx = z.infer<typeof PerpsAssetCtxSchema>;
export type SpotAssetCtx = z.infer<typeof SpotAssetCtxSchema>;
export type TwapState = z.infer<typeof TwapStateSchema>;
export type TwapStatus = z.infer<typeof TwapStatusSchema>;
export type WsTwapSliceFill = z.infer<typeof WsTwapSliceFillSchema>;
export type WsTwapHistory = z.infer<typeof WsTwapHistorySchema>;

export type AllMids = z.infer<typeof AllMidsSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type WebData2 = z.infer<typeof WebData2Schema>;
export type Candle = z.infer<typeof CandleSchema>;
export type L2BookData = z.infer<typeof L2BookDataSchema>;
export type WsBook = z.infer<typeof WsBookSchema>;
export type WsUserEvent = z.infer<typeof WsUserEventSchema>;
export type WsUserFills = z.infer<typeof WsUserFillsSchema>;
export type WsUserFundings = z.infer<typeof WsUserFundingsSchema>;
export type WsDeposit = z.infer<typeof WsDepositSchema>;
export type WsWithdraw = z.infer<typeof WsWithdrawSchema>;
export type WsInternalTransfer = z.infer<typeof WsInternalTransferSchema>;
export type WsSubAccountTransfer = z.infer<typeof WsSubAccountTransferSchema>;
export type LiquidatedPosition = z.infer<typeof LiquidatedPositionSchema>;
export type WsLedgerLiquidation = z.infer<typeof WsLedgerLiquidationSchema>;
export type WsVaultDelta = z.infer<typeof WsVaultDeltaSchema>;
export type WsVaultWithdrawal = z.infer<typeof WsVaultWithdrawalSchema>;
export type WsVaultLeaderCommission = z.infer<
  typeof WsVaultLeaderCommissionSchema
>;
export type WsSpotTransfer = z.infer<typeof WsSpotTransferSchema>;
export type WsAccountClassTransfer = z.infer<
  typeof WsAccountClassTransferSchema
>;
export type WsSpotGenesis = z.infer<typeof WsSpotGenesisSchema>;
export type WsRewardsClaim = z.infer<typeof WsRewardsClaimSchema>;
export type WsLedgerUpdate = z.infer<typeof WsLedgerUpdateSchema>;
export type WsUserNonFundingLedgerUpdate = z.infer<
  typeof WsUserNonFundingLedgerUpdateSchema
>;
export type WsUserNonFundingLedgerUpdates = z.infer<
  typeof WsUserNonFundingLedgerUpdatesSchema
>;
export type WsActiveAssetCtx = z.infer<typeof WsActiveAssetCtxSchema>;
export type WsActiveSpotAssetCtx = z.infer<typeof WsActiveSpotAssetCtxSchema>;
export type WsActiveAssetData = z.infer<typeof WsActiveAssetDataSchema>;
export type WsUserTwapSliceFills = z.infer<typeof WsUserTwapSliceFillsSchema>;
export type WsUserTwapHistory = z.infer<typeof WsUserTwapHistorySchema>;
export type WsBbo = z.infer<typeof WsBboSchema>;
