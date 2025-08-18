import Link from 'next/link';
import { Hyperliquid } from './icons/hyperliquid';
import { NavLink } from './nav-link';
import { ConnectButton } from './connect-button';

export function Navbar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b bg-card px-2.5">
      <div className="flex items-center gap-5.5">
        <Link href="/">
          <Hyperliquid className="ml-1.5" />
        </Link>
        <div className="flex items-center gap-4.5 text-xs">
          <NavLink href="/trade">Trade</NavLink>
          <NavLink href="/vaults">Vaults</NavLink>
          <NavLink href="/portfolio">Portfolio</NavLink>
          <NavLink href="/staking">Staking</NavLink>
          <NavLink href="/referrals">Referrals</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
        </div>
      </div>
      <ConnectButton />
    </nav>
  );
}
