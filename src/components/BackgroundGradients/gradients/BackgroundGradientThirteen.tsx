import { useBreakpoint } from "@/hooks";
import { Box } from "@mantine/core";

export const BackgroundGradientThirteen = () => {
  const { isTablet } = useBreakpoint();

  return (
    <>
      {isTablet && (
        <Box
          pos="absolute"
          w={248}
          h={234}
          left={9}
          top={-50}
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
      )}
    </>
  );
};
