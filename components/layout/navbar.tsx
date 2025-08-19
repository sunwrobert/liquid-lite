import Link from 'next/link';
import { Hyperliquid } from '../icons/hyperliquid';
import { ConnectButton } from '../wallet/connect-button';
import { NavLink } from './nav-link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between bg-card px-2.5">
      <div className="flex items-center gap-5.5">
        <Link href="/">
          <Hyperliquid className="ml-1.5" />
        </Link>
        <div className="flex items-center gap-4.5 text-xs">
          <NavLink href="/trade">Trade</NavLink>
        </div>
      </div>
      <ConnectButton />
    </nav>
  );
}
