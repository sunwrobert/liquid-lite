'use client';

import { SquareArrowOutUpRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTrades } from '@/hooks/use-trades';
import { formatNumber, formatPrice, formatTime } from '@/lib/format';
import { useTradeContext } from '@/providers/trade-provider';

export function LiveTrades() {
  const { asset, tradingType } = useTradeContext();
  const { data: trades = [] } = useTrades({ coin: asset });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Price ({tradingType === 'perps' ? 'USD' : 'USDC'})
              </TableHead>
              <TableHead className="justify-end text-right">
                Size ({asset})
              </TableHead>
              <TableHead className="justify-end text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade, index) => {
              const price = Number.parseFloat(trade.px);
              const size = Number.parseFloat(trade.sz);
              const isBuy = trade.side === 'A'; // 'A' = buy, 'B' = sell in HyperLiquid

              return (
                <TableRow key={`trade-${trade.hash}-${index}`}>
                  <TableCell className={isBuy ? 'text-success' : 'text-error'}>
                    {formatPrice(price)}
                  </TableCell>
                  <TableCell className="justify-end text-right">
                    {formatNumber(size, { display: 'standard' })}
                  </TableCell>
                  <TableCell className="justify-end text-right">
                    <div className="flex items-center justify-end gap-1">
                      {formatTime(trade.time)}
                      <a
                        className="text-primary hover:underline"
                        href={`https://app.hyperliquid.xyz/explorer/tx/${trade.hash}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <SquareArrowOutUpRight size={12} />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
