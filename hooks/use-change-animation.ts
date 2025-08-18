'use client';

import { usePrevious } from '@/hooks/use-previous';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

type NumberFormatDisplay = 'percent' | 'usd' | 'standard';

export type UseChangeAnimationOptions = {
  value: number | undefined | null;
  onChangeAnimationClassName?: string;
  onPositiveChangeAnimationClassName?: string;
  onNegativeChangeAnimationClassName?: string;
  display?: NumberFormatDisplay;
};

export const useChangeAnimation = ({
  value,
  onChangeAnimationClassName = 'animate-change-flash',
  onPositiveChangeAnimationClassName = 'animate-positive-flash',
  onNegativeChangeAnimationClassName = 'animate-negative-flash',
  display = 'standard',
}: UseChangeAnimationOptions) => {
  const formattedValue =
    value !== null && value !== undefined
      ? formatNumber(value, { display })
      : '';
  const previousValue = usePrevious(value);
  const previousFormattedValue = usePrevious(formattedValue);

  const hasFormattedValueChanged =
    typeof previousFormattedValue !== 'undefined' &&
    previousFormattedValue !== formattedValue;
  const hasRawValueChanged =
    typeof previousValue !== 'undefined' && previousValue !== value;

  const animationClassName = cn({
    // Apply change animation if the formatted value has changed.
    [onChangeAnimationClassName]: hasFormattedValueChanged,
    // Apply positive/negative change classes if the raw value has changed.
    ...(typeof previousValue === 'number' && hasRawValueChanged
      ? {
          [onPositiveChangeAnimationClassName]: (value ?? 0) > previousValue,
          [onNegativeChangeAnimationClassName]: (value ?? 0) < previousValue,
        }
      : {}),
  });

  // The re-render key is used to force the component to re-render when the value changes (e.g. to re-apply the animations)
  return { animationClassName, rerenderKey: formattedValue };
};
