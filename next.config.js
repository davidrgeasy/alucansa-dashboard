/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTA: Se quitó 'output: export' para permitir rutas dinámicas
  // con problemas creados por el usuario (guardados en localStorage).
  // Para exportación estática, descomentar la línea siguiente:
  // output: 'export',
  
  // Para servir desde subdirectorio, descomentar y ajustar:
  // basePath: '/alucansa',
  // assetPrefix: '/alucansa/',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

