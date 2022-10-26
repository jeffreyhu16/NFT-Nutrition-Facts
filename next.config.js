/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'svc.blockdaemon.com',
        port: '',
        pathname: '/nft/v1/ethereum/mainnet/media/**'
      }
    ]
  }
}

module.exports = nextConfig
