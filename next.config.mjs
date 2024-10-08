/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  staticPageGenerationTimeout: 180,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dalleproduse.blob.core.windows.net",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
