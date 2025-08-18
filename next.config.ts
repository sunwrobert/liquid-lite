import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  },
  async redirects() {
    return await [
      {
        source: '/',
        destination: '/trade',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
