import { cn } from '@/lib/utils';

type StatChangeProps = {
  change: number | null;
  children: React.ReactNode;
  className?: string;
};

export function StatChange({ change, children, className }: StatChangeProps) {
  return (
    <div
      className={cn(
        {
          'text-error': change !== null && change < 0,
          'text-success': change !== null && change > 0,
        },
        'contents',
        className
      )}
    >
      {children}
    </div>
  );
}
