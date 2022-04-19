/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/teezzim',
  async rewrites() {
    return process.env.NODE_ENV == 'production'
      ? []
      : [
          {
            source: '/teeapi/v1/:path*',
            destination: 'https://dev.mnemosyne.co.kr/teeapi/v1/:path*',
          },
        ];
  },
};

module.exports = nextConfig;
