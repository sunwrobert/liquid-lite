'use client';

// biome-ignore lint/performance/noNamespaceImport: this is fine
import * as TabsPrimitive from '@radix-ui/react-tabs';
import type * as React from 'react';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn('flex flex-col gap-2', className)}
      data-slot="tabs"
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex w-fit items-center justify-center', className)}
      data-slot="tabs-list"
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'group inline-flex h-6 items-center justify-center gap-1.5 whitespace-nowrap border-transparent border-b px-3 py-0 transition-colors data-[state=active]:z-1 data-[state=active]:border-primary',
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    >
      <Text className="font-medium text-muted-foreground group-data-[state=active]:text-foreground">
        {children}
      </Text>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('flex-1 outline-none', className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
