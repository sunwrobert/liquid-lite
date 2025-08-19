import { TradePage } from '@/components/trade/trade-page';
import { getChartInterval, getTradePreferences } from '@/lib/cookies/trade';

export default async function TradePageRoute() {
  const preferences = await getTradePreferences();
  const initialInterval = await getChartInterval();

  return (
    <TradePage
      asset={preferences.asset}
      initialInterval={initialInterval}
      tradingType={preferences.tradingType}
    />
  );
}
