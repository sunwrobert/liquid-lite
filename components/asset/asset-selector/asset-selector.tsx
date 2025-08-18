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
};

export function AssetSelector({ selectedAsset }: AssetSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="sticky left-0 flex items-center justify-between gap-3 rounded-md bg-card px-3 py-2 font-medium text-sm transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&[data-state=closed]>svg]:rotate-0 [&[data-state=open]>svg]:rotate-180"
          type="button"
        >
          <Text className="font-medium text-xl">{selectedAsset}</Text>
          <ChevronDownIcon className="transition-transform" size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <AssetSelectContent />
      </PopoverContent>
    </Popover>
  );
}
