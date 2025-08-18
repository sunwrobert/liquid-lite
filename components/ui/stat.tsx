import { cn } from '@/lib/utils';

function Stat({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col items-center gap-1', className)}
      {...props}
    />
  );
}

function StatLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-muted-foreground text-xs', className)} {...props} />
  );
}

function StatValue({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('font-medium text-sm', className)} {...props} />;
}

export { Stat, StatLabel, StatValue };
