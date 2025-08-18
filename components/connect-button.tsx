'use client';

import { usePrivy } from '@privy-io/react-auth';
import { formatAddress } from '@/lib/address';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Text } from './ui/text';

export function ConnectButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return <Button disabled>Loading...</Button>;
  }

  if (authenticated && user?.wallet?.address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">{formatAddress(user.wallet.address)}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex justify-between">
            <Text>Master</Text>
            <Text>{formatAddress(user.wallet.address)}</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-primary" onClick={logout}>
            <Text>Disconnect</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <Button onClick={login}>Connect</Button>;
}
