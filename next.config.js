/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Para servir desde subdirectorio, descomentar y ajustar:
  // basePath: '/alucansa',
  // assetPrefix: '/alucansa/',
  images: {
    unoptimized: true, // Necesario para export estático
  },
}

module.exports = nextConfig

