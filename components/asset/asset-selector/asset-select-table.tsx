'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { StatChange } from '@/components/ui/stat-change';
import { Text } from '@/components/ui/text';
import { formatNumber } from '@/lib/format';
import type {
  AssetContext,
  SpotAssetContext,
  SpotUniverseItem,
  UniverseItem,
} from '@/lib/schemas';

const PERCENTAGE_MULTIPLIER = 100;

type AssetData = {
  universe: UniverseItem | SpotUniverseItem;
  context: AssetContext | SpotAssetContext;
  isSpot?: boolean;
};

type AssetSelectTableProps = {
  assets: AssetData[];
  searchTerm: string;
  selectedTab: string;
};

function createColumns(showFunding: boolean): ColumnDef<AssetData>[] {
  const baseColumns: ColumnDef<AssetData>[] = [
    {
      id: 'symbol',
      header: 'Symbol',
      accessorFn: (row) => row.universe.name,
      enableSorting: true,
      cell: ({ row }) => {
        const asset = row.original;
        return (
          <div className="flex items-center gap-2">
            <Text className="font-medium">
              {asset.isSpot
                ? asset.universe.name
                : `${asset.universe.name}-USD`}
            </Text>
            {asset.isSpot ? (
              <Badge>SPOT</Badge>
            ) : (
              'maxLeverage' in asset.universe &&
              asset.universe.maxLeverage && (
                <Badge>{asset.universe.maxLeverage}x</Badge>
              )
            )}
          </div>
        );
      },
    },
    {
      id: 'lastPrice',
      header: 'Last Price',
      accessorFn: (row) => Number.parseFloat(row.context.markPx || '0'),
      enableSorting: true,
      cell: ({ getValue }) => {
        const markPx = getValue() as number;
        return (
          <Text>
            {formatNumber(markPx, {
              display: 'standard',
              options: {
                minimumSignificantDigits: 4,
                maximumSignificantDigits: 6,
              },
            })}
          </Text>
        );
      },
    },
    {
      id: 'change24h',
      header: '24h Change',
      accessorFn: (row) => {
        const markPx = Number.parseFloat(row.context.markPx || '0');
        const prevDayPx = Number.parseFloat(row.context.prevDayPx || '0');
        const change24h = markPx - prevDayPx;
        return prevDayPx > 0
          ? (change24h / prevDayPx) * PERCENTAGE_MULTIPLIER
          : 0;
      },
      enableSorting: true,
      cell: ({ row }) => {
        const markPx = Number.parseFloat(row.original.context.markPx || '0');
        const prevDayPx = Number.parseFloat(
          row.original.context.prevDayPx || '0'
        );
        const change24h = markPx - prevDayPx;
        const changePercent24h =
          prevDayPx > 0 ? (change24h / prevDayPx) * PERCENTAGE_MULTIPLIER : 0;

        return (
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
        );
      },
    },
  ];

  if (showFunding) {
    baseColumns.push({
      id: 'funding',
      header: '8hr Funding',
      accessorFn: (row) => {
        const funding =
          'funding' in row.context && row.context.funding
            ? Number.parseFloat(row.context.funding)
            : null;
        return funding;
      },
      enableSorting: true,
      cell: ({ getValue }) => {
        const funding = getValue() as number | null;
        return (
          <Text>
            {funding !== null
              ? formatNumber(funding, {
                  display: 'percent',
                  options: { maximumSignificantDigits: 3 },
                })
              : '—'}
          </Text>
        );
      },
    });
  }

  baseColumns.push({
    id: 'volume',
    header: 'Volume',
    accessorFn: (row) => Number.parseFloat(row.context.dayNtlVlm || '0'),
    enableSorting: true,
    cell: ({ getValue }) => {
      const volume = getValue() as number;
      return (
        <Text>
          {formatNumber(volume, {
            display: 'usd',
          })}
        </Text>
      );
    },
  });

  if (showFunding) {
    baseColumns.push({
      id: 'openInterest',
      header: 'Open Interest',
      accessorFn: (row) => {
        const openInterest =
          'openInterest' in row.context && row.context.openInterest
            ? Number.parseFloat(row.context.openInterest)
            : 0;
        return openInterest;
      },
      enableSorting: true,
      cell: ({ getValue }) => {
        const openInterest = getValue() as number;
        return (
          <Text>
            {openInterest > 0
              ? formatNumber(openInterest, { display: 'usd' })
              : '—'}
          </Text>
        );
      },
    });
  }

  return baseColumns;
}

export function AssetSelectTable({
  assets,
  searchTerm,
  selectedTab,
}: AssetSelectTableProps) {
  const router = useRouter();

  // Filter assets based on search term - memoized for performance
  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) =>
        asset.universe.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [assets, searchTerm]
  );

  // Hide funding column for spot-only tabs
  const showFunding = selectedTab !== 'spot';

  // Create columns based on whether to show funding
  const columns = useMemo(() => createColumns(showFunding), [showFunding]);

  return (
    <DataTable
      className="scrollbar-hidden"
      columns={columns}
      data={filteredAssets}
      enableSorting={true}
      enableVirtualization={filteredAssets.length > 50}
      estimatedRowHeight={24}
      height={400}
      onRowClick={(row) => {
        router.push(`/trade/${row.universe.name}`);
      }}
      onRowHover={(row) => {
        router.prefetch(`/trade/${row.universe.name}`);
      }}
    />
  );
}
