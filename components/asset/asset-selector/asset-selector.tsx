'use client';

import { ChevronDownIcon } from 'lucide-react';

import { CoinIcon } from '@/components/icons/coin-icon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import { useMetaAndAssetCtxs } from '@/hooks/use-meta-and-asset-ctxs';
import { useSpotMetaAndAssetCtxs } from '@/hooks/use-spot-meta-and-asset-ctxs';
import { useTradeContext } from '@/providers/trade-provider';
import { AssetSelectContent } from './asset-select-content';

type AssetSelectProps = {
  selectedAsset: string;
};

export function AssetSelector({ selectedAsset }: AssetSelectProps) {
  const { tradingType } = useTradeContext();

  // Start loading assets immediately, even before popover opens
  useMetaAndAssetCtxs({
    queryOptions: {
      refetchInterval: 5000,
    },
  });

  useSpotMetaAndAssetCtxs({
    queryOptions: {
      refetchInterval: 5000,
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="sticky left-0 flex items-center justify-between gap-3 rounded-md bg-card px-3 py-2 font-medium text-sm transition-none focus-visible:outline-none disabled:opacity-50 [&[data-state=closed]>svg]:rotate-0 [&[data-state=open]>svg]:rotate-180"
          type="button"
        >
          <div className="flex items-center gap-2">
            <CoinIcon coin={selectedAsset} size={20} />
            <Text className="font-medium text-xl">
              {tradingType === 'spot'
                ? `${selectedAsset}/USDC`
                : `${selectedAsset}-USD`}
            </Text>
          </div>
          <ChevronDownIcon className="transition-transform" size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="fixed inset-0 h-screen w-screen max-w-screen rounded-none border-0 p-0 md:relative md:inset-auto md:h-auto md:w-auto md:max-w-none md:rounded-md md:border md:p-1">
        <AssetSelectContent />
      </PopoverContent>
    </Popover>
  );
}
