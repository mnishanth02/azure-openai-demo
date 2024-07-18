/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // for static export
  experimental: {
    // Enable caching layers
    cacheDirs: [".next/cache", "node_modules/.cache/next-server"],
  },
};

export default nextConfig;
