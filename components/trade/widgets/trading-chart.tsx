'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { TradingType } from '@/lib/cookies/trade';

type TradingChartProps = {
  asset: string;
  tradingType: TradingType;
};

export function TradingChart({ asset, tradingType }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Initialize TradingView chart
    // For now, we'll show a placeholder
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = `
        <div style="
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          color: white;
          border-radius: 8px;
        ">
          <div>
            <h3>TradingView Chart</h3>
            <p>Asset: ${asset}</p>
            <p>Type: ${tradingType}</p>
            <p>Chart integration coming soon...</p>
          </div>
        </div>
      `;
    }
  }, [asset, tradingType]);

  return (
    <Card className="h-full p-0">
      <div className="flex items-center justify-between border-b p-4">
        <Text className="font-medium">{asset} Chart</Text>
        <div className="flex gap-2 text-muted-foreground text-sm">
          <span>{tradingType}</span>
        </div>
      </div>
      <div className="flex-1 p-4" ref={chartContainerRef} />
    </Card>
  );
}
