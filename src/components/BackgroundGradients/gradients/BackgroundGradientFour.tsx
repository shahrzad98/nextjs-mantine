import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientFour = () => {
  const { isTablet } = useBreakpoint();

  return isTablet ? (
    <>
      <Box
        pos="absolute"
        w={248}
        h={234}
        top={0}
        right={0}
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
      <Box
        pos="absolute"
        w={253}
        h={239}
        bottom={-60}
        left={-70}
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
  ) : (
    <>
      <Box
        pos="absolute"
        w={378}
        h={356}
        top={20}
        left={0}
        right={0}
        sx={{
          borderRadius: "100%",
          opacity: 0.12,
          background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
          filter: "blur(45px)",
          transform: "rotate(172.08deg)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      <Box
        pos="absolute"
        w={253}
        h={239}
        bottom={43}
        left={202}
        right={0}
        sx={{
          borderRadius: "100%",
          opacity: 0.16,
          background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
          filter: "blur(35px)",
          transform: "rotate(-42.609deg)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
};
