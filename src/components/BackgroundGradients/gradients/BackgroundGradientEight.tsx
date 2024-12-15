import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientEight = () => {
  const { isTablet } = useBreakpoint();

  return (
    <Box
      pos="absolute"
      w={!isTablet ? 291 : 189}
      h={!isTablet ? 274 : 178}
      top={0}
      bottom={0}
      left={0}
      right={0}
      m="auto"
      sx={{
        borderRadius: "100%",
        opacity: 0.16,
        background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
        filter: !isTablet ? "blur(35px)" : "blur(22.7px)",
        transform: "rotate(-130.019deg)",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};
