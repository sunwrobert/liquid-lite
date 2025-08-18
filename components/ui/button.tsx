import { Slot } from '@radix-ui/react-slot';
import type * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const buttonVariants = tv({
  base: "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-xs outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: {
    variant: {
      default:
        'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
      destructive:
        'bg-destructive text-white shadow-xs hover:bg-destructive/90',
      secondary:
        'border bg-card text-card-foreground shadow-xs outline-border hover:bg-card/80',
      ghost:
        'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
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

export { Button, buttonVariants };
