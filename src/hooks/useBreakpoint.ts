import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const useBreakpoint = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.xl})`);

  return { isMobile, isTablet, isDesktop };
};
