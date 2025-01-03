import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientNine = () => {
  const { isTablet } = useBreakpoint();

  return (
    <>
      <Box
        pos="absolute"
        w={!isTablet ? 509 : 248}
        h={!isTablet ? 480 : 234}
        top={!isTablet ? -79 : -33}
        right={!isTablet ? -42 : -43}
        sx={{
          borderRadius: "100%",
          opacity: 0.16,
          background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
          filter: !isTablet ? "blur(45px)" : "blur(35px)",
          transform: "rotate(172.08deg)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
};
