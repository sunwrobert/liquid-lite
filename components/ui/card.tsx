import type * as React from 'react';

import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col rounded bg-card p-3 text-card-foreground',
        className
      )}
      data-slot="card"
      {...props}
    />
  );
}

export { Card };
