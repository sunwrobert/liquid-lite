import type { Metadata } from 'next';
import { TradePage } from '@/components/trade/trade-page';

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
  return <TradePage asset={params.asset} tradingType="spot" />;
}
