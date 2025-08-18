import { cn } from '@/lib/utils';
import { Text } from './text';

function Stat({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col items-start gap-1', className)}
      {...props}
    />
  );
}

function StatLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <Text
      className={cn('text-muted-foreground', className)}
      size="sm"
      weight="regular"
      {...props}
    />
  );
}

function StatValue({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <Text className={className} size="sm" weight="semibold" {...props} />;
}

export { Stat, StatLabel, StatValue };
