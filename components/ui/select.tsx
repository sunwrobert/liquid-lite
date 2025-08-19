'use client';

// biome-ignore lint/performance/noNamespaceImport: Radix UI requires namespace import
import * as SelectPrimitive from '@radix-ui/react-select';
import type * as React from 'react';
import { SelectButton } from '@/components/ui/select-button';
import { Text } from '@/components/ui/text';
import { popoverContentVariants } from '@/lib/style';
import { cn } from '@/lib/utils';

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = 'sm',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'lg';
}) {
  return (
    <SelectPrimitive.Trigger asChild data-slot="select-trigger" {...props}>
      <SelectButton className={className} size={size}>
        {children}
      </SelectButton>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          popoverContentVariants(),
          'max-h-(--radix-select-content-available-height) w-fit origin-(--radix-select-content-transform-origin)',
          className
        )}
        data-slot="select-content"
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-1 py-1 text-muted-foreground outline-hidden hover:text-foreground focus:text-foreground data-[disabled]:pointer-events-none data-[state=checked]:text-foreground data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center",
        className
      )}
      data-slot="select-item"
      {...props}
    >
      <SelectPrimitive.ItemText asChild>
        <Text size="sm">{children}</Text>
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
