/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['placehold.co'],
  },
  // Configurações para produção
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Configurações de build
  experimental: {
    outputStandalone: true,
  },
}

module.exports = nextConfig