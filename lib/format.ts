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
