import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'hokehjxsejqbhbeugqnt.supabase.co' },
      { protocol: 'https', hostname: 'pub-6ad3b83efdde42349387698c6194502b.r2.dev' },
      { protocol: 'https', hostname: '**.r2.dev' },
    ],
  },
  // output: 'standalone',
  transpilePackages: ['motion'],
};

export default nextConfig;
