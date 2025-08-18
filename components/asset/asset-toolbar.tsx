import { Card } from '@/components/ui/card';
import { Text } from '../ui/text';
import { AssetStats } from './asset-stats';

export function AssetToolbar() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Text size="lg" weight="semibold">
              HYPE-USD
            </Text>
          </div>
        </div>
        <AssetStats />
      </div>
    </Card>
  );
}
