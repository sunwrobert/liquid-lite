'use client';

import { SquareArrowOutUpRight } from 'lucide-react';
import { ChangeAnimation } from '@/components/ui/change-animation';
import { Stat, StatLabel, StatValue } from '@/components/ui/stat';
import { StatChange } from '@/components/ui/stat-change';
import { useSpotMetaAndAssetCtxs } from '@/hooks/use-spot-meta-and-asset-ctxs';
import { formatAddress } from '@/lib/address';
import { formatNumber } from '@/lib/format';

type AssetSpotStatsProps = {
  asset: string;
};

const PERCENTAGE_MULTIPLIER = 100;

export function AssetSpotStats({ asset }: AssetSpotStatsProps) {
  const { data, isLoading, error } = useSpotMetaAndAssetCtxs({
    asset,
  });

  if (isLoading) {
    return null;
  }

  if (error || !data) {
    return (
      <Stat>
        <StatLabel>Error</StatLabel>
        <StatValue>Failed to load data</StatValue>
      </Stat>
    );
  }

  // For spot, try both the direct asset key and asset/usdc format
  const assetKey = asset.toLowerCase();
  const spotAssetKey = asset.includes('/') ? assetKey : `${assetKey}/usdc`;

  const assetCtx = data.assets[spotAssetKey] || data.assets[assetKey];

  if (!assetCtx) {
    return (
      <Stat>
        <StatLabel>Asset</StatLabel>
        <StatValue>Not found</StatValue>
      </Stat>
    );
  }

  // Calculate 24h change
  const markPx = Number.parseFloat(assetCtx.markPx);
  const prevDayPx = Number.parseFloat(assetCtx.prevDayPx);
  const change24h = markPx - prevDayPx;
  const changePercent24h = (change24h / prevDayPx) * PERCENTAGE_MULTIPLIER;

  // Calculate market cap using circulatingSupply from spot data
  const circulatingSupply = assetCtx.circulatingSupply
    ? Number.parseFloat(assetCtx.circulatingSupply)
    : null;
  const marketCap = circulatingSupply ? markPx * circulatingSupply : null;

  // Get contract address from tokens data
  const baseAsset = asset.split('/')[0]?.toLowerCase() || asset.toLowerCase();
  const contractToken = data.tokens?.find(
    (token) =>
      token.name.toLowerCase() === baseAsset ||
      token.fullName?.toLowerCase().includes(baseAsset)
  );
  const contractAddress = contractToken?.tokenId || null;

  return (
    <>
      <Stat>
        <StatLabel>Price</StatLabel>
        <StatValue>
          <ChangeAnimation value={markPx}>
            {formatNumber(markPx, {
              display: 'standard',
              options: {
                minimumSignificantDigits: 5,
                maximumSignificantDigits: 5,
              },
            })}
          </ChangeAnimation>
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Change</StatLabel>
        <StatValue>
          <StatChange change={change24h}>
            {formatNumber(change24h, {
              display: 'standard',
              options: {
                minimumSignificantDigits: 4,
                maximumSignificantDigits: 4,
              },
            })}{' '}
            /{' '}
            {formatNumber(changePercent24h / PERCENTAGE_MULTIPLIER, {
              display: 'percent',
            })}
          </StatChange>
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Volume</StatLabel>
        <StatValue>
          {formatNumber(Number.parseFloat(assetCtx.dayNtlVlm), {
            display: 'usd',
          })}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>Market Cap</StatLabel>
        <StatValue>
          {marketCap !== null
            ? formatNumber(marketCap, {
                display: 'usd',
              })
            : '--'}
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>Contract</StatLabel>
        <StatValue>
          {contractAddress ? (
            <div className="flex items-center gap-1">
              <span className="text-xs">{formatAddress(contractAddress)}</span>
              <a
                className="text-primary hover:underline"
                href={`https://app.hyperliquid.xyz/explorer/token/${contractAddress}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <SquareArrowOutUpRight size={12} />
              </a>
            </div>
          ) : null}
        </StatValue>
      </Stat>
    </>
  );
}
