import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Reading notes</span>,
  project: {
    link: "https://github.com/mkrtchian/reading-notes",
  },
  docsRepositoryBase: "https://github.com/mkrtchian/reading-notes/blob/main",
  footer: {
    text: "Made by Roman Mkrtchian",
  },
};

export default config;
