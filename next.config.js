/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**'
      }
    ],
    domains: ['images.gr-assets.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3001',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET_KEY || 'j8P3xKfDb5sRmEqNvCz9HgY7tWuA2XoL1ZrGi6JyT4Q=',
    WEB_API_URL: process.env.WEB_API_URL || 'https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com/',
    JWT_TIMEOUT: process.env.REACT_APP_JWT_TIMEOUT || '86400',
    JWT_SECRET: process.env.REACT_APP_JWT_SECRET || 'e7NpT2vD8qRxK3fA9ZbQmS6LcY4UhW5G1jOiXoEu='
  }
};

module.exports = nextConfig;
