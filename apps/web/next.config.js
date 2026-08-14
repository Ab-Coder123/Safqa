/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@safqa/types', '@safqa/utils', '@safqa/ui'],
};

module.exports = nextConfig;
