'use client';

import { ChevronDownIcon } from 'lucide-react';
import type * as React from 'react';
import type { ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const selectButtonVariants = tv({
  base: 'flex items-center justify-between rounded-md bg-card font-medium transition-none focus-visible:outline-none disabled:opacity-50 [&[data-state=closed]>svg]:rotate-0 [&[data-state=open]>svg]:rotate-180',
  variants: {
    size: {
      sm: 'gap-2 px-2 py-1 text-xs',
      lg: 'gap-3 px-3 py-2 text-sm',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

const selectButtonTextVariants = tv({
  base: 'font-medium',
  variants: {
    size: {
      sm: 'text-xs',
      lg: 'text-xl',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

type SelectButtonProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof selectButtonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SelectButton({
  children,
  className,
  size,
  ...props
}: SelectButtonProps) {
  return (
    <button
      className={cn(selectButtonVariants({ size }), className)}
      type="button"
      {...props}
    >
      <Text className={selectButtonTextVariants({ size })}>{children}</Text>
      <ChevronDownIcon
        className="transition-transform"
        size={size === 'sm' ? 16 : 20}
      />
    </button>
  );
}
