type TradeLayoutProps = {
  children: React.ReactNode;
};

export default function TradeLayout({ children }: TradeLayoutProps) {
  return <div className="p-1 pb-0">{children}</div>;
}
