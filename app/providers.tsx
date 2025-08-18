'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { arbitrum, base, mainnet } from 'wagmi/chains';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const appId = useMemo(() => process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '', []);

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          showWalletLoginFirst: false,
        },
        loginMethods: ['wallet'],
        embeddedWallets: { createOnLogin: 'users-without-wallets' },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
