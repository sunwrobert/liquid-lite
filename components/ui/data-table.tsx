'use client';

import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import type * as React from 'react';
import { useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableSorting?: boolean;
  enableVirtualization?: boolean;
  height?: number;
  estimatedRowHeight?: number;
  className?: string;
  onRowClick?: (row: TData) => void;
  onRowHover?: (row: TData) => void;
};

function SortableHeader({
  column,
  children,
  className,
}: {
  column: {
    getCanSort: () => boolean;
    getIsSorted: () => false | 'asc' | 'desc';
    getToggleSortingHandler: () => ((event: unknown) => void) | undefined;
  };
  children: React.ReactNode;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <div className={className}>{children}</div>;
  }

  const sortDirection = column.getIsSorted();

  return (
    <button
      className={cn('-mx-1 flex items-center gap-1 rounded px-1', className)}
      onClick={column.getToggleSortingHandler()}
      type="button"
    >
      {children}
      <div className="flex flex-col">
        {sortDirection === 'asc' ? (
          <ChevronUpIcon className="h-3 w-3" />
          // biome-ignore lint/style/noNestedTernary: this is fine
        ) : sortDirection === 'desc' ? (
          <ChevronDownIcon className="h-3 w-3" />
        ) : (
          <div className="flex flex-col">
            <ChevronUpIcon className="h-2.5 w-2.5 opacity-40" />
            <ChevronDownIcon className="-mt-0.5 h-2.5 w-2.5 opacity-40" />
          </div>
        )}
      </div>
    </button>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableSorting = true,
  enableVirtualization = false,
  height = 400,
  estimatedRowHeight = 32,
  className,
  onRowClick,
  onRowHover,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    state: {
      sorting: enableSorting ? sorting : undefined,
    },
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimatedRowHeight,
    enabled: enableVirtualization,
  });

  if (enableVirtualization) {
    return (
      <div className={cn('relative', className)}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-0" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {/** biome-ignore lint/style/noNestedTernary: this is fine */}
                    {header.isPlaceholder ? null : enableSorting ? (
                      <SortableHeader
                        className={cn(
                          'flex-1 whitespace-nowrap font-medium text-muted-foreground text-xs'
                        )}
                        column={header.column}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </SortableHeader>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>

        <div
          className="scrollbar-hidden overflow-auto"
          ref={tableContainerRef}
          style={{ height: `${height}px` }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            <Table>
              <TableBody>
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const row = rows[virtualItem.index];
                  return (
                    <TableRow
                      className={cn(
                        'absolute w-full border-0 transition-none hover:bg-border',
                        onRowClick && 'cursor-pointer'
                      )}
                      data-index={virtualItem.index}
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      onMouseEnter={() => onRowHover?.(row.original)}
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div
                          className="flex h-full flex-1 items-center whitespace-nowrap text-xs [&:first-child]:pl-2.5 [&:last-child]:pr-2.5"
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  // Non-virtualized table
  return (
    <div className={cn('relative', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border-0" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {/** biome-ignore lint/style/noNestedTernary: this is fine */}
                  {header.isPlaceholder ? null : enableSorting ? (
                    <SortableHeader column={header.column}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </SortableHeader>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className={cn(
                  'border-0 transition-none hover:bg-border',
                  onRowClick && 'cursor-pointer'
                )}
                data-state={row.getIsSelected() && 'selected'}
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                onMouseEnter={() => onRowHover?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    className="flex h-6 flex-1 items-center whitespace-nowrap text-xs [&:first-child]:pl-2.5 [&:last-child]:pr-2.5"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <div
                className="h-24 text-center"
                style={{ gridColumn: `span ${columns.length}` }}
              >
                No results.
              </div>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
