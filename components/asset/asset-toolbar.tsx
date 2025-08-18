import { Card } from '@/components/ui/card';
import { Text } from '../ui/text';
import { AssetStats } from './asset-stats';

type AssetToolbarProps = {
  asset?: string;
};

export function AssetToolbar({ asset = 'HYPE' }: AssetToolbarProps) {
  const displayName = asset ? `${asset.toUpperCase()}-USD` : 'HYPE-USD';

  return (
    <Card className="max-h-16">
      <div className="scrollbar-hidden flex items-center overflow-x-auto">
        <div className="sticky left-0 flex shrink-0 items-center gap-2 bg-card py-1 pr-8">
          <Text size="lg" weight="semibold">
            {displayName}
          </Text>
        </div>
        <AssetStats />
      </div>
    </Card>
  );
}
