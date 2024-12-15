import { useBreakpoint } from "@/hooks";
import { Box, createStyles, Paper, rem, Text, Title } from "@mantine/core";
import { PropsWithChildren, ReactNode, useRef } from "react";
import sanitizeHtml from "sanitize-html";

import { Footer } from "../Footer";
import { Navbar } from "../Navbar";
import { NavbarVariant } from "../Navbar/types";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    minHeight: "100vh",
    backgroundSize: "cover !important",
    backgroundPosition: "center !important",
    overflowX: "hidden",

    [theme.fn.smallerThan("sm")]: {
      background: "none",
    },
  },

  side: {
    minHeight: "100vh",
    position: "relative",
    maxWidth: rem(450),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: rem(80),
    background: "none",

    [theme.fn.smallerThan("sm")]: {
      background: "none",
      maxWidth: "100%",
    },
  },

  title: {
    fontSize: "24px",
    lineHeight: "30px",
    color: "#FFFFFF",
  },

  description: {
    fontSize: "12px",
    lineHeight: "15px",
    color: "#FFFFFF",
  },

  copyright: {
    fontSize: "12px",
    lineHeight: "42px",
    letterSpacing: "0.5px",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
  },
}));

interface IAuthenticationLayoutProps {
  image: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
}

export const AuthenticationLayout = ({
  image,
  title,
  description,
  children,
}: PropsWithChildren<IAuthenticationLayoutProps>) => {
  const { isMobile } = useBreakpoint();
  const { classes } = useStyles();

  const ref = useRef<HTMLDivElement>(null);

  const containerWidth = ref?.current?.offsetWidth;

  return (
    <>
      <Paper
        className={classes.side}
        radius={0}
        py={20}
        px={isMobile ? 30 : 50}
        ref={ref}
        sx={{ overflow: isMobile ? "hidden" : undefined }}
      >
        <Box>
          <Navbar variant={NavbarVariant.Basic} height={25} containerHeight={25} />
          {title && (
            <Title className={classes.title} fw={"400"} mt={isMobile ? rem(8.5) : 28}>
              {title}
            </Title>
          )}
          {description && (
            <Text className={classes.description} fw={"400"} mt={8}>
              {typeof description === "string" ? sanitizeHtml(description) : description}
            </Text>
          )}
          {children}
        </Box>

        <Footer copyrightOnly />
      </Paper>
      <Box
        pos="fixed"
        bg={`url(${image})`}
        bgr="no-repeat"
        className={classes.wrapper}
        w={`calc(100% - ${rem(`${containerWidth || 450}px`)})`}
      />
    </>
  );
};
