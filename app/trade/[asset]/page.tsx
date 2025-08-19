import type { Metadata } from 'next';
import { TradePage } from '@/components/trade/trade-page';
import { getChartInterval } from '@/lib/cookies/trade';

type AssetPerpsPageProps = {
  params: { asset: string };
};

export async function generateMetadata({
  params,
}: AssetPerpsPageProps): Promise<Metadata> {
  const { asset } = await params;
  return await {
    title: `${asset.toUpperCase()} Perpetuals - Trade`,
    description: `Trade ${asset.toUpperCase()} perpetual futures`,
  };
}

export default async function AssetPerpsPage({ params }: AssetPerpsPageProps) {
  const { asset } = await params;
  const initialInterval = await getChartInterval();

  return (
    <TradePage
      asset={asset}
      initialInterval={initialInterval}
      tradingType="perps"
    />
  );
}
