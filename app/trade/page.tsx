import { TradePage } from '@/components/trade/trade-page';
import { getTradePreferences } from '@/lib/cookies/trade';

export default async function TradePageRoute() {
  const preferences = await getTradePreferences();

  return (
    <TradePage
      asset={preferences.asset}
      tradingType={preferences.tradingType}
    />
  );
}
