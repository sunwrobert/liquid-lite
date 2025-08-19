'use client';

import {
  CandlestickSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';
import { useCandle } from '@/hooks/use-candle';
import type { CandleInterval } from '@/hooks/use-candle-subscription';
import { cn } from '@/lib/utils';
import { useTradeContext } from '@/providers/trade-provider';

// Primary intervals shown as buttons - ensure selected interval is always visible
const getPrimaryIntervals = (
  selectedInterval: CandleInterval
): CandleInterval[] => {
  const defaultPrimary: CandleInterval[] = ['5m', '1h', '1d'];
  if (defaultPrimary.includes(selectedInterval)) {
    return defaultPrimary;
  }
  // Replace the middle interval with the selected one if it's not in the default set
  return [defaultPrimary[0], selectedInterval, defaultPrimary[2]];
};

// All available intervals for dropdown
const ALL_INTERVALS: { value: CandleInterval; label: string }[] = [
  { value: '1m', label: '1 minute' },
  { value: '3m', label: '3 minutes' },
  { value: '5m', label: '5 minutes' },
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '2h', label: '2 hours' },
  { value: '4h', label: '4 hours' },
  { value: '8h', label: '8 hours' },
  { value: '12h', label: '12 hours' },
  { value: '1d', label: '1 day' },
  { value: '3d', label: '3 days' },
  { value: '1w', label: '1 week' },
  { value: '1M', label: '1 month' },
];

export function TradingChart() {
  const { asset, interval, setInterval } = useTradeContext();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const primaryIntervals = getPrimaryIntervals(interval);

  const { data: candles } = useCandle({
    coin: asset,
    interval,
  });

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      timeScale: {
        borderColor: '#4b5563',
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderColor: '#4b5563',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        minimumWidth: 80,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!(seriesRef.current && candles?.length)) {
      return;
    }

    const chartData = candles.map((candle) => ({
      time: (candle.t / 1000) as UTCTimestamp,
      open: candle.o,
      high: candle.h,
      low: candle.l,
      close: candle.c,
    }));

    seriesRef.current.setData(chartData);
  }, [candles]);

  return (
    <Card className="h-full overflow-hidden p-0">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-4">
          {/* Interval Selector */}
          <div className="flex items-center gap-1">
            {/* Primary interval buttons */}
            {primaryIntervals.map((intervalOption) => (
              <Button
                className={cn(interval === intervalOption && 'text-foreground')}
                key={intervalOption}
                onClick={() => setInterval(intervalOption)}
                size="sm"
                variant="ghost"
              >
                {intervalOption}
              </Button>
            ))}

            {/* Dropdown for all intervals */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 text-muted-foreground transition-colors hover:text-foreground">
                <ChevronDownIcon size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {ALL_INTERVALS.map((intervalOption) => (
                  <DropdownMenuItem
                    className={cn(
                      interval === intervalOption.value && 'bg-accent'
                    )}
                    key={intervalOption.value}
                    onClick={() => setInterval(intervalOption.value)}
                  >
                    <Text className="text-sm">{intervalOption.label}</Text>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div
        className="relative flex-1 overflow-hidden"
        ref={chartContainerRef}
      />
    </Card>
  );
}
