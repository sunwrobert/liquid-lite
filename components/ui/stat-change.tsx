import { cn } from '@/lib/utils';

type StatChangeProps = {
  change: number | null;
  children: React.ReactNode;
  contrast?: boolean;
  className?: string;
};

export function StatChange({
  change,
  children,
  contrast,
  className,
}: StatChangeProps) {
  return (
    <div
      className={cn(
        {
          'text-error': change !== null && change < 0,
          'text-success': change !== null && change > 0,
          'text-success-2': contrast && change !== null && change > 0,
        },
        'contents',
        className
      )}
    >
      {children}
    </div>
  );
}
