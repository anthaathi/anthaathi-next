const config = require('@anthaathi-internal/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
