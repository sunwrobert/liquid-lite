import { z } from 'zod';
import {
  type MetaAndAssetCtxsResponse,
  MetaAndAssetCtxsResponseSchema,
  type SpotMetaAndAssetCtxsResponse,
  SpotMetaAndAssetCtxsResponseSchema,
} from './schemas';
import {
  type Candle,
  CandleSchema,
  type L2BookData,
  L2BookDataSchema,
} from './websocket-schemas';

const API_BASE_URL = 'https://api.hyperliquid.xyz';

type PerpDexsRequest = {
  type: 'perpDexs';
};

type MetaRequest = {
  type: 'meta';
  dex?: string;
};

type MetaAndAssetCtxsRequest = {
  type: 'metaAndAssetCtxs';
};

type ClearinghouseStateRequest = {
  type: 'clearinghouseState';
  user: string;
  dex?: string;
};

type UserFundingRequest = {
  type: 'userFunding';
  user: string;
  startTime: number;
  endTime?: number;
};

type UserNonFundingLedgerUpdatesRequest = {
  type: 'userNonFundingLedgerUpdates';
  user: string;
  startTime: number;
  endTime?: number;
};

type FundingHistoryRequest = {
  type: 'fundingHistory';
  coin: string;
  startTime: number;
  endTime?: number;
};

type PredictedFundingsRequest = {
  type: 'predictedFundings';
};

type PerpsAtOpenInterestCapRequest = {
  type: 'perpsAtOpenInterestCap';
  coins?: string[];
};

type PerpDeployAuctionStatusRequest = {
  type: 'perpDeployAuctionStatus';
};

type ActiveAssetDataRequest = {
  type: 'activeAssetData';
  user: string;
  coin: string;
  leverage?: {
    type: string;
    value: number;
  };
};

type SpotMetaRequest = {
  type: 'spotMeta';
};

type SpotMetaAndAssetCtxsRequest = {
  type: 'spotMetaAndAssetCtxs';
};

type SpotClearinghouseStateRequest = {
  type: 'spotClearinghouseState';
  user: string;
};

type SpotDeployStateRequest = {
  type: 'spotDeployState';
  user: string;
};

type TokenDetailsRequest = {
  type: 'tokenDetails';
  tokenId: string;
};

type L2BookRequest = {
  type: 'l2Book';
  coin: string;
  nSigFigs?: number;
  mantissa?: number;
};

type CandleSnapshotRequest = {
  type: 'candleSnapshot';
  req: {
    coin: string;
    interval: string;
    startTime: number;
    endTime: number;
  };
};

type ApiRequest =
  | PerpDexsRequest
  | MetaRequest
  | MetaAndAssetCtxsRequest
  | ClearinghouseStateRequest
  | UserFundingRequest
  | UserNonFundingLedgerUpdatesRequest
  | FundingHistoryRequest
  | PredictedFundingsRequest
  | PerpsAtOpenInterestCapRequest
  | PerpDeployAuctionStatusRequest
  | ActiveAssetDataRequest
  | SpotMetaRequest
  | SpotMetaAndAssetCtxsRequest
  | SpotClearinghouseStateRequest
  | SpotDeployStateRequest
  | TokenDetailsRequest
  | L2BookRequest
  | CandleSnapshotRequest;

function apiRequest<T>(request: ApiRequest): Promise<T> {
  return fetch(`${API_BASE_URL}/info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  });
}

// Specific API functions
export async function getMetaAndAssetCtxs(): Promise<MetaAndAssetCtxsResponse> {
  const data = await apiRequest({ type: 'metaAndAssetCtxs' });
  return MetaAndAssetCtxsResponseSchema.parse(data);
}

export async function getSpotMetaAndAssetCtxs(): Promise<SpotMetaAndAssetCtxsResponse> {
  const data = await apiRequest({ type: 'spotMetaAndAssetCtxs' });
  return SpotMetaAndAssetCtxsResponseSchema.parse(data);
}

export async function getL2Book(
  coin: string,
  nSigFigs?: number,
  mantissa?: number
): Promise<L2BookData> {
  const data = await apiRequest({ type: 'l2Book', coin, nSigFigs, mantissa });
  return L2BookDataSchema.parse(data);
}

export async function getCandleSnapshot(
  coin: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<Candle[]> {
  const data = await apiRequest({
    type: 'candleSnapshot',
    req: { coin, interval, startTime, endTime },
  });
  return z.array(CandleSchema).parse(data);
}
