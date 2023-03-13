const { GITHUB_TOKEN } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: { GITHUB_TOKEN },
};

module.exports = nextConfig;
