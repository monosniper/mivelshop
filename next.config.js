/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', 'inshop-online.com'],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (!isServer) {
      config.node = {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      }
    }

    return config
  },
}

module.exports = nextConfig
