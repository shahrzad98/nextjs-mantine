import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientTwelve = () => {
  const { isTablet } = useBreakpoint();

  return isTablet ? (
    <Box
      pos="absolute"
      w={248}
      h={234}
      left={-23}
      top={-35}
      sx={{
        borderRadius: "100%",
        opacity: 0.16,
        background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
        filter: "blur(35px)",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  ) : (
    <>
      <Box
        pos="absolute"
        w={493}
        h={465}
        left={42}
        top={-216}
        sx={{
          borderRadius: "100%",
          opacity: 0.12,
          background: "linear-gradient(59deg, #3077F3 19.98%, #ED35F5 88.56%)",
          filter: "blur(40px)",
          transform: "rotate(-50.468deg)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      <Box
        pos="absolute"
        w={378}
        h={356}
        left={416}
        top={-35}
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
    </>
  );
};
