import { useBreakpoint } from "@/hooks";
import { TopTitle } from "@/modules";
import { BackgroundImage, Center, Container, Text, createStyles, rem } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  mainText: {
    maxWidth: rem(761),
    textAlign: "center",
    fontWeight: 600,
    fontSize: rem(40),
    lineHeight: rem(51),
    letterSpacing: "-0.02em",
    color: "rgba(255, 255, 255, 0.80)",
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      fontSize: rem(20),
      fontWeight: 700,
      lineHeight: rem(27.5),
      marginBottom: rem(8),
    },
  },
  topText: {
    fontSize: rem(24),
    fontWeight: 500,
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },
  centerText: {
    maxWidth: rem(761),
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    margin: "5% auto",

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      paddingLeft: rem(29),
      paddingRight: rem(29),
      fontSize: rem(20),
      fontWeight: 700,
    },
  },
  background: {
    display: "flex",
    flexDirection: "column",
    marginTop: rem(-80),
  },
  bottomText: {
    marginTop: rem(28),
    color: "rgba(255, 255, 255, 0.70)",
    fontSize: rem(20),
    fontWeight: 700,
    lineHeight: rem(27),
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(14),
      fontWeight: 500,
      lineHeight: rem(21),
    },
  },
}));

export const ContactUsTop = () => {
  const { classes } = useStyles();
  const { isMobile } = useBreakpoint();

  return (
    <Container fluid px={0}>
      <BackgroundImage
        src={"./img/contact-us/contact-us-bg.png"}
        h={rem(isMobile ? 385 : 500)}
        className={classes.background}
      >
        <TopTitle pageName="Contact Us" />
        <Center className={classes.centerText}>
          <Text className={classes.mainText}>We love hearing from our customers!</Text>
          <Text className={classes.bottomText}>
            Please feel free to contact us with any questions, comments, or feedback using one of
            the methods below.
          </Text>
        </Center>
      </BackgroundImage>
    </Container>
  );
};
