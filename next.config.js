/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      child_process: false
    }
    return config
  }
}

module.exports = nextConfig 