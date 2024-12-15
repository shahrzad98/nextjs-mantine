import "@fontsource/inter";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { Preview } from "@storybook/react";

export const decorators = [
  (Story) => (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        fontFamily: "Inter",
      }}
    >
      <Notifications />
      <ModalsProvider>
        <Story />
      </ModalsProvider>
    </MantineProvider>
  ),
];

export const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
