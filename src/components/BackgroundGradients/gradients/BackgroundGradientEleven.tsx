import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientEleven = () => {
  const { isTablet } = useBreakpoint();

  return (
    <>
      <Box
        pos="absolute"
        w={!isTablet ? 605 : 248}
        h={!isTablet ? 571 : 234}
        top={!isTablet ? -140 : -29}
        right={!isTablet ? "auto" : -2}
        left={!isTablet ? -235 : "auto"}
        sx={{
          borderRadius: "100%",
          opacity: !isTablet ? 0.12 : 0.16,
          background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
          filter: !isTablet ? "blur(40px)" : "blur(35px)",
          transform: "rotate(172.08deg)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
};
