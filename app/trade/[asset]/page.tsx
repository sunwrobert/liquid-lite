import type { Metadata } from 'next';
import { TradePage } from '@/components/trade/trade-page';

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
  return <TradePage asset={params.asset} tradingType="perps" />;
}
