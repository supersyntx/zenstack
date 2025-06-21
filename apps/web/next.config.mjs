/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@space/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // Allow images from all domains
      },
      {
        protocol: "http",
        hostname: "*", // Allow images from all domains
      },
    ],
  },
};

export default nextConfig;
