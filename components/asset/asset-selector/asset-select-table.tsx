'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { StatChange } from '@/components/ui/stat-change';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { formatNumber } from '@/lib/format';
import type {
  AssetContext,
  SpotAssetContext,
  SpotUniverseItem,
  UniverseItem,
} from '@/lib/schemas';

const PERCENTAGE_MULTIPLIER = 100;

type AssetSelectTableProps = {
  assets: Array<{
    universe: UniverseItem | SpotUniverseItem;
    context: AssetContext | SpotAssetContext;
    isSpot?: boolean;
  }>;
  searchTerm: string;
};

type AssetRowProps = {
  asset: {
    universe: UniverseItem | SpotUniverseItem;
    context: AssetContext | SpotAssetContext;
    isSpot?: boolean;
  };
};

const AssetRow = memo(function AssetRowBase({
  asset: assetProp,
}: AssetRowProps) {
  const markPx = Number.parseFloat(assetProp.context.markPx || '0');
  const prevDayPx = Number.parseFloat(assetProp.context.prevDayPx || '0');
  const change24h = markPx - prevDayPx;
  const changePercent24h =
    prevDayPx > 0 ? (change24h / prevDayPx) * PERCENTAGE_MULTIPLIER : 0;
  const funding =
    'funding' in assetProp.context && assetProp.context.funding
      ? Number.parseFloat(assetProp.context.funding)
      : null;
  const volume = Number.parseFloat(assetProp.context.dayNtlVlm || '0');
  const openInterest =
    'openInterest' in assetProp.context && assetProp.context.openInterest
      ? Number.parseFloat(assetProp.context.openInterest)
      : 0;

  return (
    <TableRow className="h-6 border-0 transition-none hover:bg-border">
      <TableCell className="h-6 p-0 align-middle">
        <Link
          className="flex cursor-pointer items-center gap-2"
          href={`/trade/${assetProp.universe.name}`}
        >
          <Text className="font-medium">
            {assetProp.isSpot
              ? assetProp.universe.name
              : `${assetProp.universe.name}-USD`}
          </Text>
          {assetProp.isSpot ? (
            <Badge>SPOT</Badge>
          ) : (
            'maxLeverage' in assetProp.universe &&
            assetProp.universe.maxLeverage && (
              <Badge>{assetProp.universe.maxLeverage}x</Badge>
            )
          )}
        </Link>
      </TableCell>
      <TableCell className="h-6 p-0 align-middle">
        <Text>
          {formatNumber(markPx, {
            display: 'standard',
            options: {
              minimumSignificantDigits: 4,
              maximumSignificantDigits: 6,
            },
          })}
        </Text>
      </TableCell>
      <TableCell className="h-6 p-0 align-middle">
        <Text>
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
              options: { maximumFractionDigits: 2 },
            })}
          </StatChange>
        </Text>
      </TableCell>
      <TableCell className="h-6 p-0 align-middle">
        <Text>
          {funding !== null
            ? formatNumber(funding, {
                display: 'percent',
                options: { maximumSignificantDigits: 3 },
              })
            : '—'}
        </Text>
      </TableCell>
      <TableCell className="h-6 p-0 align-middle">
        <Text>
          {formatNumber(volume, {
            display: 'usd',
          })}
        </Text>
      </TableCell>
      <TableCell className="h-6 p-0 align-middle">
        <Text>
          {openInterest > 0
            ? formatNumber(openInterest, { display: 'usd' })
            : '—'}
        </Text>
      </TableCell>
    </TableRow>
  );
});

export function AssetSelectTable({
  assets,
  searchTerm,
}: AssetSelectTableProps) {
  // Filter assets based on search term - memoized for performance
  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) =>
        asset.universe.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [assets, searchTerm]
  );

  return (
    <div className="scrollbar-hidden max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-0">
            <TableHead className="h-6 border-0 p-0 align-middle">
              <Text className="text-muted-foreground">Symbol</Text>
            </TableHead>
            <TableHead className="h-6 border-0 p-0 align-middle">
              <Text className="text-muted-foreground">Last Price</Text>
            </TableHead>
            <TableHead className="h-6 border-0 p-0 align-middle">
              <Text className="text-muted-foreground">24h Change</Text>
            </TableHead>
            <TableHead className="h-6 border-0 p-0 align-middle">
              <Text className="text-muted-foreground">8hr Funding</Text>
            </TableHead>
            <TableHead className="h-6 border-0 p-0 align-middle">
              <Text className="text-muted-foreground">Volume</Text>
            </TableHead>
            <TableHead className="h-6 border-0 p-0 align-middle">
              <Text className="text-muted-foreground">Open Interest</Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssets.map((asset) => (
            <AssetRow asset={asset} key={asset.universe.name} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
