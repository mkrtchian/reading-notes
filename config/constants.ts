export const description =
  "My detailed reading notes from computer science books";

const isProduction = process.env.NODE_ENV === "production";
export const assetPrefix = isProduction ? "/reading-notes" : "";
