'use client';

import { ChevronDownIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Text } from '@/components/ui/text';

import { AssetSelectContent } from './asset-select-content';

type AssetSelectProps = {
  selectedAsset: string;
  onAssetSelect: (asset: string) => void;
};

export function AssetSelector({
  selectedAsset,
  onAssetSelect,
}: AssetSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="sticky left-0 flex items-center justify-between gap-1.5 rounded-md bg-card px-3 py-2 font-medium text-sm transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&[data-state=closed]>svg]:rotate-0 [&[data-state=open]>svg]:rotate-180"
          type="button"
        >
          <Text className="font-medium text-xl">{selectedAsset}</Text>
          <ChevronDownIcon className="h-4 w-4 transition-transform" size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <AssetSelectContent
          onAssetSelect={onAssetSelect}
          onClose={() => {
            // Close popover - handled by Radix internally
          }}
          selectedAsset={selectedAsset}
        />
      </PopoverContent>
    </Popover>
  );
}
