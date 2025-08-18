import { Card } from '@/components/ui/card';
import { AssetStats } from './asset-stats';

export function AssetToolbar() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">HYPE-USD</span>
            <span className="rounded bg-muted px-2 py-1 text-muted-foreground text-xs">
              PERP
            </span>
          </div>
        </div>
        <AssetStats />
      </div>
    </Card>
  );
}
