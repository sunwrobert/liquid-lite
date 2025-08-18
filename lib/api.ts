import {
  type MetaAndAssetCtxsResponse,
  MetaAndAssetCtxsResponseSchema,
  type SpotMetaAndAssetCtxsResponse,
  SpotMetaAndAssetCtxsResponseSchema,
} from './schemas';

const API_BASE_URL = 'https://api.hyperliquid.xyz';

export type PerpDexsRequest = {
  type: 'perpDexs';
};

export type MetaRequest = {
  type: 'meta';
  dex?: string;
};

export type MetaAndAssetCtxsRequest = {
  type: 'metaAndAssetCtxs';
};

export type ClearinghouseStateRequest = {
  type: 'clearinghouseState';
  user: string;
  dex?: string;
};

export type UserFundingRequest = {
  type: 'userFunding';
  user: string;
  startTime: number;
  endTime?: number;
};

export type UserNonFundingLedgerUpdatesRequest = {
  type: 'userNonFundingLedgerUpdates';
  user: string;
  startTime: number;
  endTime?: number;
};

export type FundingHistoryRequest = {
  type: 'fundingHistory';
  coin: string;
  startTime: number;
  endTime?: number;
};

export type PredictedFundingsRequest = {
  type: 'predictedFundings';
};

export type PerpsAtOpenInterestCapRequest = {
  type: 'perpsAtOpenInterestCap';
  coins?: string[];
};

export type PerpDeployAuctionStatusRequest = {
  type: 'perpDeployAuctionStatus';
};

export type ActiveAssetDataRequest = {
  type: 'activeAssetData';
  user: string;
  coin: string;
  leverage?: {
    type: string;
    value: number;
  };
};

export type SpotMetaRequest = {
  type: 'spotMeta';
};

export type SpotMetaAndAssetCtxsRequest = {
  type: 'spotMetaAndAssetCtxs';
};

export type SpotClearinghouseStateRequest = {
  type: 'spotClearinghouseState';
  user: string;
};

export type SpotDeployStateRequest = {
  type: 'spotDeployState';
  user: string;
};

export type TokenDetailsRequest = {
  type: 'tokenDetails';
  tokenId: string;
};

export type ApiRequest =
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
  | TokenDetailsRequest;

// API Response type (generic since response varies by request type)
export type ApiResponse<T = unknown> = T;

// API Error type
export type ApiError = {
  message: string;
  status?: number;
};

// Generic API function
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
export function getPerpDexs(): Promise<ApiResponse> {
  return apiRequest({ type: 'perpDexs' });
}

export function getMeta(dex?: string): Promise<ApiResponse> {
  return apiRequest({ type: 'meta', dex });
}

export async function getMetaAndAssetCtxs(): Promise<MetaAndAssetCtxsResponse> {
  const data = await apiRequest({ type: 'metaAndAssetCtxs' });
  return MetaAndAssetCtxsResponseSchema.parse(data);
}

export function getClearinghouseState(
  user: string,
  dex?: string
): Promise<ApiResponse> {
  return apiRequest({ type: 'clearinghouseState', user, dex });
}

export function getUserFunding(
  user: string,
  startTime: number,
  endTime?: number
): Promise<ApiResponse> {
  return apiRequest({ type: 'userFunding', user, startTime, endTime });
}

export function getUserNonFundingLedgerUpdates(
  user: string,
  startTime: number,
  endTime?: number
): Promise<ApiResponse> {
  return apiRequest({
    type: 'userNonFundingLedgerUpdates',
    user,
    startTime,
    endTime,
  });
}

export function getFundingHistory(
  coin: string,
  startTime: number,
  endTime?: number
): Promise<ApiResponse> {
  return apiRequest({ type: 'fundingHistory', coin, startTime, endTime });
}

export function getPredictedFundings(): Promise<ApiResponse> {
  return apiRequest({ type: 'predictedFundings' });
}

export function getPerpsAtOpenInterestCap(
  coins?: string[]
): Promise<ApiResponse> {
  return apiRequest({ type: 'perpsAtOpenInterestCap', coins });
}

export function getPerpDeployAuctionStatus(): Promise<ApiResponse> {
  return apiRequest({ type: 'perpDeployAuctionStatus' });
}

export function getActiveAssetData(
  user: string,
  coin: string,
  leverage?: { type: string; value: number }
): Promise<ApiResponse> {
  return apiRequest({ type: 'activeAssetData', user, coin, leverage });
}

export function getSpotMeta(): Promise<ApiResponse> {
  return apiRequest({ type: 'spotMeta' });
}

export async function getSpotMetaAndAssetCtxs(): Promise<SpotMetaAndAssetCtxsResponse> {
  const data = await apiRequest({ type: 'spotMetaAndAssetCtxs' });
  return SpotMetaAndAssetCtxsResponseSchema.parse(data);
}

export function getSpotClearinghouseState(user: string): Promise<ApiResponse> {
  return apiRequest({ type: 'spotClearinghouseState', user });
}

export function getSpotDeployState(user: string): Promise<ApiResponse> {
  return apiRequest({ type: 'spotDeployState', user });
}

export function getTokenDetails(tokenId: string): Promise<ApiResponse> {
  return apiRequest({ type: 'tokenDetails', tokenId });
}
