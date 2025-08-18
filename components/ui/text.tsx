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
  },
  defaultVariants: {
    size: 'sm',
  },
});

function Text({
  className,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span';

  return <Comp className={cn(textVariants({ size, className }))} {...props} />;
}

export { Text, textVariants };
