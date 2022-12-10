/** @type {import('next').NextConfig} */
const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  assetPrefix: isProduction ? "/reading-notes/next" : "",
  basePath: isProduction ? "/reading-notes/next" : "",
};

module.exports = {
  ...withNextra(),
  ...nextConfig,
};
