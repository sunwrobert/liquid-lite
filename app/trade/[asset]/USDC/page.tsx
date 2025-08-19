import type { Metadata } from 'next';
import { TradePage } from '@/components/trade/trade-page';
import { getChartInterval } from '@/lib/cookies/trade';

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

export default async function AssetSpotPage({ params }: AssetSpotPageProps) {
  const initialInterval = await getChartInterval();

  return (
    <TradePage
      asset={params.asset}
      initialInterval={initialInterval}
      tradingType="spot"
    />
  );
}
