import { Slot } from '@radix-ui/react-slot';
import type * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const buttonVariants = tv({
  base: "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-xs outline-none transition-all disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: {
    variant: {
      default:
        'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
      error: 'bg-error text-white shadow-xs hover:bg-error/90',
      secondary:
        'border bg-card text-card-foreground shadow-xs outline-border hover:bg-card/80',
      ghost: 'text-muted-foreground hover:text-foreground',
    },
    size: {
      sm: 'h-8 rounded-lg px-4 has-[>svg]:px-3',
      icon: 'size-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
  compoundVariants: [
    {
      variant: 'secondary',
      size: 'sm',
      className: 'px-2',
    },
    {
      variant: 'ghost',
      size: 'sm',
      className: 'p-1',
    },
  ],
});

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button };
