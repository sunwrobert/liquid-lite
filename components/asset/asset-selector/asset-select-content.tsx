'use client';

import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { useMetaAndAssetCtxs } from '@/hooks/use-meta-and-asset-ctxs';
import { useSpotMetaAndAssetCtxs } from '@/hooks/use-spot-meta-and-asset-ctxs';
import type { AssetContext, SpotAssetContext } from '@/lib/schemas';

import { AssetSelectTable } from './asset-select-table';
import { AssetSelectTabs } from './asset-select-tabs';

export function AssetSelectContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const {
    data: perpData,
    isLoading: perpLoading,
    error: perpError,
  } = useMetaAndAssetCtxs({
    queryOptions: {
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const {
    data: spotData,
    isLoading: spotLoading,
    error: spotError,
  } = useSpotMetaAndAssetCtxs({
    queryOptions: {
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const isLoading = perpLoading || spotLoading;
  const hasError = perpError || spotError;

  if (isLoading) {
    return (
      <div className="p-4">
        <Text>Loading assets...</Text>
      </div>
    );
  }

  // biome-ignore lint/complexity/useSimplifiedLogicExpression: its fine
  if (hasError || (!perpData && !spotData && !isLoading)) {
    return (
      <div className="p-4">
        <Text>Failed to load assets</Text>
        {perpError && (
          <Text className="text-red-500">Perp error: {perpError.message}</Text>
        )}
        {spotError && (
          <Text className="text-red-500">Spot error: {spotError.message}</Text>
        )}
      </div>
    );
  }

  // Combine perp assets
  const perpAssets =
    perpData?.universe
      .map((universeItem) => ({
        universe: universeItem,
        context:
          perpData.assets[universeItem.name.toLowerCase()] ||
          ({} as AssetContext),
        isSpot: false,
      }))
      .filter((asset) => asset.context.markPx) || []; // Only show assets with valid data

  // Combine spot assets
  const spotAssets =
    spotData?.universe
      .map((universeItem) => ({
        universe: universeItem,
        context:
          spotData.assets[universeItem.name.toLowerCase()] ||
          ({} as SpotAssetContext),
        isSpot: true,
      }))
      .filter((asset) => asset.context.markPx) || []; // Only show assets with valid data

  // All assets combined
  const allAssets = [...perpAssets, ...spotAssets];

  return (
    <div className="flex min-w-[800px] flex-col gap-4">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon
          className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground"
          size={12}
        />
        <Input
          className="pl-9"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search assets..."
          value={searchTerm}
        />
      </div>

      {/* Tabs and Table */}
      <AssetSelectTabs onTabChange={setSelectedTab} selectedTab={selectedTab}>
        <TabsContent className="mt-0" value="all">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="perps">
          <AssetSelectTable
            assets={perpAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="spot">
          <AssetSelectTable
            assets={spotAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="trending">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="dex-only">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="pre-launch">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="ai">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="defi">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="gaming">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="layer1">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="layer2">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="meme">
          <AssetSelectTable
            assets={allAssets}
            searchTerm={searchTerm}
            selectedTab={selectedTab}
          />
        </TabsContent>
      </AssetSelectTabs>
    </div>
  );
}
