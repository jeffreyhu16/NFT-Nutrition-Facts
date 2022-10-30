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
  },
  publicRuntimeConfig: {
    etherscanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    polygonscanApiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY,
    alchemyEthApiKey: process.env.NEXT_PUBLIC_ALCHEMY_ETH_MAINNET_API_KEY,
    alchemyPolygonApiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_MAINNET_API_KEY,
    blockdaemonApiKey: process.env.NEXT_PUBLIC_BLOCKDAEMON_API_KEY,
  }
}

module.exports = nextConfig
