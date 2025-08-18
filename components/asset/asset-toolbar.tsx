import { Card } from '@/components/ui/card';

type AssetToolbarProps = {
  children: React.ReactNode;
};

export function AssetToolbar({ children }: AssetToolbarProps) {
  return (
    <Card className="max-h-16">
      <div className="scrollbar-hidden flex items-center overflow-x-auto">
        {children}
      </div>
    </Card>
  );
}
