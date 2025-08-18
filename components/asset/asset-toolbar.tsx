import { Card } from '@/components/ui/card';
import { Text } from '../ui/text';

type AssetToolbarProps = {
  asset: string;
  children: React.ReactNode;
};

export function AssetToolbar({ asset, children }: AssetToolbarProps) {
  const displayName = `${asset.toUpperCase()}-USD`;

  return (
    <Card className="max-h-16">
      <div className="scrollbar-hidden flex items-center overflow-x-auto">
        <div className="sticky left-0 flex shrink-0 items-center gap-2 bg-card py-1 pr-8">
          <Text size="lg" weight="semibold">
            {displayName}
          </Text>
        </div>
        {children}
      </div>
    </Card>
  );
}
