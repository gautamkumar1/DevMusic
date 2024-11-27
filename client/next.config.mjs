/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // Added for GitHub avatars
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com", // Added for Aceternity assets
      },
    ],
  },
};

export default nextConfig;
