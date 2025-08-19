import type { Metadata } from 'next';
import { TradePage } from '@/components/trade/trade-page';
import { getChartInterval } from '@/lib/cookies/trade';

type AssetSpotPageProps = {
  params: { asset: string };
};

export async function generateMetadata({
  params,
}: AssetSpotPageProps): Promise<Metadata> {
  const { asset } = await params;
  return await {
    title: `${asset.toUpperCase()}/USDC Spot - Trade`,
    description: `Trade ${asset.toUpperCase()}/USDC spot pair`,
  };
}

export default async function AssetSpotPage({ params }: AssetSpotPageProps) {
  const { asset } = await params;
  const initialInterval = await getChartInterval();

  return (
    <TradePage
      asset={asset}
      initialInterval={initialInterval}
      tradingType="spot"
    />
  );
}
