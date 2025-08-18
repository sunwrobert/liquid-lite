'use client';

import { useMetaAndAssetCtxs } from '@/hooks/use-meta-and-asset-ctxs';

export function TradePageContent() {
  const { data, isLoading, error } = useMetaAndAssetCtxs();

  if (isLoading) {
    return <div>Loading market data...</div>;
  }

  if (error) {
    return <div>Error loading market data: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">Market Data</h2>
      <pre className="overflow-auto rounded p-4 text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
