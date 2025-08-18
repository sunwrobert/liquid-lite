type FormatType = 'percent' | 'usd';

type FormatOptions = {
  display: FormatType;
  options?: Intl.NumberFormatOptions;
};

function getFormatOptions(display: FormatType): Intl.NumberFormatOptions {
  // biome-ignore lint/style/useDefaultSwitchClause: not needed
  // biome-ignore lint/nursery/noUnnecessaryConditions: not needed
  switch (display) {
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
