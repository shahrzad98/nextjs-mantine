import ErrorBoundary from "@/common/ErrorBoundary";
import { Tuple, DefaultMantineColor } from "@mantine/core";
import { MantineProvider, useMantineTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import NProgress from "nprogress";
import React, { ReactNode, useEffect } from "react";

type ExtendedCustomColors = "nvtPrimary" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

interface AppProps {
  children: ReactNode;
}

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }: AppProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  useEffect(() => {
    NProgress.start();
    setTimeout(() => NProgress.done(), 300);
  }, []);

  return (
    <QueryClientProvider client={client}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          fontFamily: "Inter",
          colors: {
            nvtPrimary: [
              "#7791F9",
              "#15AABF",
              "#3077F3",
              "#2F3348",
              "#282B3D",
              "#1E2130",
              "#17191F",
              "#1A1B1E",
              "#1A1B1E",
              "#1A1B1E",
            ],
          },
        }}
      >
        <Notifications
          position={router?.pathname?.includes("organization") ? "top-right" : "top-center"}
        />
        <ModalsProvider>
          <ErrorBoundary>
            <NextNProgress color={theme.primaryColor} height={5} showOnShallow />
            {children}
          </ErrorBoundary>
        </ModalsProvider>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
