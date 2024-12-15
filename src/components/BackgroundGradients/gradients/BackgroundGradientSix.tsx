import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientSix = () => {
  const { isTablet } = useBreakpoint();

  return (
    <>
      {isTablet && (
        <Box
          pos="absolute"
          w={226}
          h={233}
          top="17%"
          left={-128}
          sx={{
            borderRadius: "100%",
            opacity: 0.16,
            background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
            filter: "blur(45px)",
            transform: "rotate(-125.309deg)",
            zIndex: -1,
            pointerEvents: "none",
          }}
        />
      )}
      <Box
        pos="absolute"
        w={635}
        h={606}
        top={!isTablet ? 1091 : "32%"}
        left={!isTablet ? "auto" : -270}
        right={!isTablet ? -210 : "auto"}
        sx={{
          borderRadius: "100%",
          opacity: 0.12,
          background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
          filter: "blur(45px)",
          transform: "rotate(-7.92deg)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
};
