import nextra from "nextra";

const withNextra = nextra({});

const isProduction = process.env.NODE_ENV === "production";
const assetPrefix = isProduction ? "/reading-notes" : "";

export default withNextra({
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  assetPrefix,
  basePath: assetPrefix,
  output: "export",
});
