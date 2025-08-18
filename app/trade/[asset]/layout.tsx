import { AssetToolbar } from '@/components/asset/asset-toolbar';

type AssetLayoutProps = {
  children: React.ReactNode;
  params: { asset: string };
};

export default function AssetLayout({ children, params }: AssetLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <AssetToolbar asset={params.asset} />
      {children}
    </div>
  );
}
