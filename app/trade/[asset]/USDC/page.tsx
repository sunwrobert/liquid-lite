import type { Metadata } from 'next';
import { TradeProvider } from '@/providers/trade-provider';

type AssetSpotPageProps = {
  params: { asset: string };
};

// biome-ignore lint/suspicious/useAwait: this is fine
export async function generateMetadata({
  params,
}: AssetSpotPageProps): Promise<Metadata> {
  return {
    title: `${params.asset.toUpperCase()}/USDC Spot - Trade`,
    description: `Trade ${params.asset.toUpperCase()}/USDC spot pair`,
  };
}

export default function AssetSpotPage({ params }: AssetSpotPageProps) {
  return (
    <TradeProvider asset={params.asset} tradingType="spot">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 font-bold text-2xl">
          {params.asset.toUpperCase()}/USDC Spot
        </h1>
        {/* Spot trading interface will go here */}
      </div>
    </TradeProvider>
  );
}
