'use client';

import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { useMetaAndAssetCtxs } from '@/hooks/use-meta-and-asset-ctxs';
import type { AssetContext } from '@/lib/schemas';

import { AssetSelectTable } from './asset-select-table';
import { AssetSelectTabs } from './asset-select-tabs';

export function AssetSelectContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const { data, isLoading, error } = useMetaAndAssetCtxs({});

  if (isLoading) {
    return (
      <div className="p-4">
        <Text>Loading assets...</Text>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4">
        <Text>Failed to load assets</Text>
      </div>
    );
  }

  // Combine universe and asset context data
  const assets = data.universe
    .map((universeItem) => ({
      universe: universeItem,
      context:
        data.assets[universeItem.name.toLowerCase()] || ({} as AssetContext),
    }))
    .filter((asset) => asset.context.markPx); // Only show assets with valid data

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
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="perps">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="spot">
          <AssetSelectTable
            assets={assets.filter(() => false)} // No spot assets for now
            searchTerm={searchTerm}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="trending">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="dex-only">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="pre-launch">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="ai">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="defi">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="gaming">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="layer1">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="layer2">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent className="mt-0" value="meme">
          <AssetSelectTable assets={assets} searchTerm={searchTerm} />
        </TabsContent>
      </AssetSelectTabs>
    </div>
  );
}
