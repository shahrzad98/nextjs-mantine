import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientSeven = () => {
  const { isTablet } = useBreakpoint();

  return (
    <Box
      pos="absolute"
      w={!isTablet ? 535 : 248}
      h={!isTablet ? 497 : 234}
      top={!isTablet ? 631 : 441}
      left={!isTablet ? -175 : "auto"}
      right={!isTablet ? "auto" : -51}
      sx={{
        borderRadius: "100%",
        opacity: !isTablet ? 0.12 : 0.16,
        background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
        filter: "blur(45px)",
        transform: !isTablet ? "rotate(-7.92deg)" : "none",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};
