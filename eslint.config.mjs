import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["next.config.*"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".pnp.*",
      ".pnp/**",

      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",

      ".DS_Store",
      "**/*.pem",
      ".vscode/**",
      "*.log*",
      "*.tsbuildinfo",
      ".env*.local",
      ".vercel",
      "coverage/**",
    ],
  },
  prettier,
]);
