import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.hyperliquid.xyz',
        port: '',
        pathname: '/coins/**',
      },
    ],
  },
  // biome-ignore lint/suspicious/useAwait: this is fine
  async redirects() {
    return [
      {
        source: '/',
        destination: '/trade',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
