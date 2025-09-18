import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['devog.s3.amazonaws.com', 'aidatingapi.ongraph.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'devog.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aidatingapi.ongraph.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
