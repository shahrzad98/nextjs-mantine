import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientTen = () => {
  const { isTablet } = useBreakpoint();

  return (
    <>
      <Box
        pos="absolute"
        w={!isTablet ? 423 : 248}
        h={!isTablet ? 403 : 234}
        top={!isTablet ? -17 : -29}
        right={!isTablet ? "auto" : -2}
        left={!isTablet ? 163 : "auto"}
        sx={{
          borderRadius: "100%",
          opacity: 0.16,
          background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
          filter: "blur(35px)",
          transform: "rotate(172.08deg)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
};
