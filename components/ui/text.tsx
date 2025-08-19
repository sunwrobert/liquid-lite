import { Slot } from '@radix-ui/react-slot';
import type * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const textVariants = tv({
  variants: {
    size: {
      sm: 'text-xs',
      lg: 'text-xl',
    },
    weight: {
      regular: 'font-normal',
      semibold: 'font-medium',
    },
  },
  defaultVariants: {
    size: 'sm',
    weight: 'regular',
  },
});

function Text({
  className,
  size,
  weight,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      className={cn(textVariants({ size, weight, className }))}
      {...props}
    />
  );
}

export { Text };
