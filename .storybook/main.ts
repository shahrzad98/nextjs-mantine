import path from "path";

import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-actions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (webpackConfig) => {
    if (!webpackConfig.resolve) webpackConfig.resolve = {};
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      "@/components": path.resolve(__dirname, "../src/components"),
      "@/hooks": path.resolve(__dirname, "../src/hooks"),
      "@/types": path.resolve(__dirname, "../src/types"),
      "@/hooks": path.resolve(__dirname, "../src/hooks"),
    };

    return webpackConfig;
  },
};
export default config;
