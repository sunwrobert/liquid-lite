type FormatType = 'percent' | 'usd' | 'standard';

type FormatOptions = {
  display: FormatType;
  options?: Intl.NumberFormatOptions;
};

function getFormatOptions(display: FormatType): Intl.NumberFormatOptions {
  // biome-ignore lint/style/useDefaultSwitchClause: not needed
  // biome-ignore lint/nursery/noUnnecessaryConditions: not needed
  switch (display) {
    case 'standard':
      return {
        minimumSignificantDigits: 5,
        maximumSignificantDigits: 5,
      };
    case 'percent':
      return {
        style: 'percent',
        minimumFractionDigits: 2,
      };
    case 'usd':
      return {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 2,
      };
  }
}

export function formatNumber(value: number, options: FormatOptions): string {
  const formatOptions = getFormatOptions(options.display);
  return new Intl.NumberFormat('en-US', {
    ...formatOptions,
    ...options.options,
  }).format(value);
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? Number.parseFloat(price) : price;
  if (Number.isNaN(numPrice)) {
    return '0.00';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(numPrice);
}

export function formatVolume(volume: string | number): string {
  const numVolume =
    typeof volume === 'string' ? Number.parseFloat(volume) : volume;
  if (Number.isNaN(numVolume)) {
    return '0';
  }

  if (numVolume >= 1e9) {
    return `${(numVolume / 1e9).toFixed(2)}B`;
  }
  if (numVolume >= 1e6) {
    return `${(numVolume / 1e6).toFixed(2)}M`;
  }
  if (numVolume >= 1e3) {
    return `${(numVolume / 1e3).toFixed(2)}K`;
  }

  return numVolume.toFixed(2);
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function calculatePriceIncrements(currentPrice: number): number[] {
  if (currentPrice >= 100) {
    // For high prices (>=100): 0.1, 0.2, 0.5, 1, 10, 100
    return [0.1, 0.2, 0.5, 1, 10, 100];
  }
  if (currentPrice >= 10) {
    // For medium prices (10-100): 0.01, 0.02, 0.05, 0.1, 1, 10
    return [0.01, 0.02, 0.05, 0.1, 1, 10];
  }
  if (currentPrice >= 1) {
    // For unit prices (1-10): 0.001, 0.002, 0.005, 0.01, 0.1, 1
    return [0.001, 0.002, 0.005, 0.01, 0.1, 1];
  }
  if (currentPrice >= 0.1) {
    // For decimal prices (0.1-1): 0.0001, 0.0002, 0.0005, 0.001, 0.01, 0.1
    return [0.0001, 0.0002, 0.0005, 0.001, 0.01, 0.1];
  }
  if (currentPrice >= 0.01) {
    // For small prices (0.01-0.1): 0.00001, 0.00002, 0.00005, 0.0001, 0.001, 0.01
    return [0.000_01, 0.000_02, 0.000_05, 0.0001, 0.001, 0.01];
  }
  // For very small prices (<0.01): 0.000001, 0.000002, 0.000005, 0.00001, 0.0001, 0.001
  return [0.000_001, 0.000_002, 0.000_005, 0.000_01, 0.0001, 0.001];
}

export function priceIncrementToNSigFigs(increment: number): {
  nSigFigs: number;
  mantissa?: number;
} {
  // Convert price increment to nSigFigs and mantissa for API calls
  if (increment >= 1) {
    return { nSigFigs: 2 };
  }
  if (increment >= 0.1) {
    return { nSigFigs: 3 };
  }
  if (increment >= 0.01) {
    return { nSigFigs: 4 };
  }
  // For smaller increments, use 5 sig figs with appropriate mantissa
  const incrementStr = increment.toString();
  if (incrementStr.includes('1')) {
    return { nSigFigs: 5, mantissa: 1 };
  }
  if (incrementStr.includes('2')) {
    return { nSigFigs: 5, mantissa: 2 };
  }
  return { nSigFigs: 5, mantissa: 5 };
}
