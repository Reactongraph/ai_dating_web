import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['devog.s3.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'devog.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
