/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.shein.com',
      },
      {
        protocol: 'https',
        hostname: '**.ltwebstatic.com',
      },
      {
        protocol: 'https',
        hostname: '**.waslaship.net',
      },
    ],
  },
};

export default nextConfig;
