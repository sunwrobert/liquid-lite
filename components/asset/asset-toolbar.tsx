import { Card } from '@/components/ui/card';
import { Text } from '../ui/text';
import { AssetStats } from './asset-stats';

export function AssetToolbar() {
  return (
    <Card className="max-h-16">
      <div className="scrollbar-hidden flex items-center overflow-x-auto">
        <div className="sticky left-0 flex h-12 shrink-0 items-center gap-2 bg-card pr-8">
          <Text size="lg" weight="semibold">
            HYPE-USD
          </Text>
        </div>
        <AssetStats />
      </div>
    </Card>
  );
}
