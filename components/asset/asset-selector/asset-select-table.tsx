'use client';

import Link from 'next/link';

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
import type { AssetContext, UniverseItem } from '@/lib/schemas';

const PERCENTAGE_MULTIPLIER = 100;

type AssetSelectTableProps = {
  assets: Array<{
    universe: UniverseItem;
    context: AssetContext;
  }>;
  searchTerm: string;
};

export function AssetSelectTable({
  assets,
  searchTerm,
}: AssetSelectTableProps) {
  // Filter assets based on search term and limit to first 10 for performance
  const filteredAssets = assets
    .filter((asset) =>
      asset.universe.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

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
          {filteredAssets.map((asset) => {
            const markPx = Number.parseFloat(asset.context.markPx || '0');
            const prevDayPx = Number.parseFloat(asset.context.prevDayPx || '0');
            const change24h = markPx - prevDayPx;
            const changePercent24h =
              prevDayPx > 0
                ? (change24h / prevDayPx) * PERCENTAGE_MULTIPLIER
                : 0;
            const funding = Number.parseFloat(asset.context.funding || '0');
            const volume = Number.parseFloat(asset.context.dayNtlVlm || '0');
            const openInterest = Number.parseFloat(
              asset.context.openInterest || '0'
            );

            return (
              <TableRow
                className="h-6 border-0 transition-none hover:bg-border"
                key={asset.universe.name}
              >
                <TableCell className="h-6 p-0 align-middle">
                  <Link
                    className="flex cursor-pointer items-center gap-2"
                    href={`/trade/${asset.universe.name}`}
                  >
                    <Text className="font-medium">
                      {asset.universe.name}-USD
                    </Text>
                    <Badge>{asset.universe.maxLeverage}x</Badge>
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
                    {formatNumber(funding, {
                      display: 'percent',
                      options: { maximumSignificantDigits: 3 },
                    })}
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
                    {formatNumber(openInterest, {
                      display: 'usd',
                    })}
                  </Text>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
