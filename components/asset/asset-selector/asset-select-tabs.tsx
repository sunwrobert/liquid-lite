'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AssetSelectTabsProps = {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
};

export function AssetSelectTabs({
  selectedTab,
  onTabChange,
  children,
}: AssetSelectTabsProps) {
  return (
    <Tabs className="flex-1" onValueChange={onTabChange} value={selectedTab}>
      <TabsList className="scrollbar-hidden overflow-x-auto">
        <TabsTrigger value="all">All Coins</TabsTrigger>
        <TabsTrigger value="perps">Perps</TabsTrigger>
        <TabsTrigger value="spot">Spot</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="dex-only">DEX Only</TabsTrigger>
        <TabsTrigger value="pre-launch">Pre-launch</TabsTrigger>
        <TabsTrigger value="ai">AI</TabsTrigger>
        <TabsTrigger value="defi">DeFi</TabsTrigger>
        <TabsTrigger value="gaming">Gaming</TabsTrigger>
        <TabsTrigger value="layer1">Layer 1</TabsTrigger>
        <TabsTrigger value="layer2">Layer 2</TabsTrigger>
        <TabsTrigger value="meme">Meme</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
