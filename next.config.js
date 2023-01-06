/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/teezzim',
  images: {
    domains: ['www.mauna.co.kr'],
  },
  async rewrites() {
    return [
      {
        source: '/teeapi/v1/:path*',
        // destination: 'http://localhost:4000/teeapi/v1/:path*',
        destination: 'https://dev.mnemosyne.co.kr/teeapi/v1/:path*',
      },
      {
        source: '/api/webview/:path*',
        // destination: 'http://localhost:4000/teeapi/v1/:path*',
        destination: 'https://dev.mnemosyne.co.kr/api/webview/:path*',
      },
      {
        source: '/api/crawler/:path*',
        // destination: 'http://localhost:4000/teeapi/v1/:path*',
        destination: 'https://dev.mnemosyne.co.kr/api/crawler/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
