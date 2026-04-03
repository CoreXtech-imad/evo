/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ add this line
  },
}

module.exports = nextConfig
