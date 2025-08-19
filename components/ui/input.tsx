'use client';

import type * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-md border border-border bg-transparent py-1 pr-3 pl-2.5 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-xs placeholder:text-muted-foreground hover:border-muted-foreground focus-visible:border-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
