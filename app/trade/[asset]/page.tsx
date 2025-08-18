import type { Metadata } from 'next';
import { TradeProvider } from '@/providers/trade-provider';

type AssetPerpsPageProps = {
  params: { asset: string };
};

// biome-ignore lint/suspicious/useAwait: this is fine
export async function generateMetadata({
  params,
}: AssetPerpsPageProps): Promise<Metadata> {
  return {
    title: `${params.asset.toUpperCase()} Perpetuals - Trade`,
    description: `Trade ${params.asset.toUpperCase()} perpetual futures`,
  };
}

export default function AssetPerpsPage({ params }: AssetPerpsPageProps) {
  return (
    <TradeProvider asset={params.asset} tradingType="perps">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 font-bold text-2xl">
          {params.asset.toUpperCase()} Perpetuals
        </h1>
        {/* Trading interface will go here */}
      </div>
    </TradeProvider>
  );
}
