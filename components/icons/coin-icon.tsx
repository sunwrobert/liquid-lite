import Image from 'next/image';
import type * as React from 'react';
import { cn } from '@/lib/utils';

type CoinIconProps = {
  coin: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function CoinIcon({ coin, size = 20, className, style }: CoinIconProps) {
  return (
    <Image
      alt={coin}
      className={cn('rounded-full', className)}
      height={size}
      src={`https://app.hyperliquid.xyz/coins/${coin}.svg`}
      style={{
        background: 'white',
        ...style,
      }}
      width={size}
    />
  );
}
