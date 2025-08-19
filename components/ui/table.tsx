/** biome-ignore-all lint/a11y/useFocusableInteractive: this is a table */
/** biome-ignore-all lint/a11y/useSemanticElements: this is a table */
'use client';

import type * as React from 'react';

import { cn } from '@/lib/utils';

function Table({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full flex-col gap-0.5 text-sm', className)}
      data-slot="table"
      role="table"
      {...props}
    />
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full', className)}
      data-slot="table-header"
      role="rowgroup"
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full flex-col gap-0.5', className)}
      data-slot="table-body"
      role="rowgroup"
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full transition-colors', className)}
      data-slot="table-row"
      role="row"
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex-1 whitespace-nowrap font-medium text-muted-foreground text-xs [&:first-child]:pl-2.5 [&:last-child]:pr-2.5',
        className
      )}
      data-slot="table-head"
      role="columnheader"
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-6 flex-1 items-center whitespace-nowrap text-xs [&:first-child]:pl-2.5 [&:last-child]:pr-2.5',
        className
      )}
      data-slot="table-cell"
      role="cell"
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };
