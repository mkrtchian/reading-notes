/** @type {import('next').NextConfig} */
const withNextra = require("nextra")({
  reactStrictMode: true,
  swcMinify: true,
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

module.exports = withNextra();
