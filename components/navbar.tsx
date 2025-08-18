import { Hyperliquid } from './icons/Hyperliquid';
import { Button } from './ui/button';

export function Navbar() {
  return (
    <nav className="flex h-14 items-center justify-between p-2.5">
      <Hyperliquid className="ml-1.5" />
      <Button>Connect</Button>
    </nav>
  );
}
