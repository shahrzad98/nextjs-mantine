import { TopTitle } from "@/modules";
import { BackgroundImage, Button, Center, Container, Text, createStyles, rem } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  topWrapper: {
    padding: "40px 100px",
    justifyContent: "space-between",
    [theme.fn.smallerThan("sm")]: {
      padding: "20px 30px",
    },
  },
  mainText: {
    width: "100%",
    maxWidth: rem(761),
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(48),
    lineHeight: rem(51),
    letterSpacing: "-0.02em",
    color: "#FFFFFF",
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
      fontWeight: 800,
      lineHeight: rem(32),
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
    width: "100%",
    maxWidth: rem(761),
    padding: `0 ${rem(27)}`,
    display: "flex",
    flexDirection: "column",
    gap: rem(13),
    textAlign: "center",
    margin: "5% auto",

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      marginTop: rem(68),
      fontSize: rem(20),
      fontWeight: 700,
      gap: rem(35),
    },
  },
  background: {
    display: "flex",
    flexDirection: "column",
    height: rem(710),
    [theme.fn.smallerThan("sm")]: {
      height: rem(632),
    },
  },
  bottomText: {
    fontSize: rem(20),
    fontWeight: 700,
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(14),
      fontWeight: 500,
    },
  },

  breadcrumbs: {
    display: "flex",
    flexDirection: "row",
    gap: rem(8),
    color: "#FFFFFF80",
    textDecoration: "none",
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  active: {
    color: "#FFFFFFCC",
  },
  button: {
    fontSize: rem(15),
    fontWeight: 400,
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));

export const ForOrganizersTopSection = () => {
  const { classes } = useStyles();

  const navigateToForm = () => {
    const element = document.getElementById("formContainer");
    element?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  };

  return (
    <Container fluid px={0} mt={rem(-90)}>
      <BackgroundImage
        src={"./img/for-organizer/for-organizer-bg.png"}
        className={classes.background}
      >
        <TopTitle pageName={"For Organizers"} />
        <Center className={classes.centerText}>
          <Text className={classes.mainText}>
            {`Sell tickets with the ultimate event ticketing platform`}
          </Text>
          <Text className={classes.bottomText}>
            {`Upload your tickets and set your price to sell and receive payments. Our ethical pricing
            system ensures that you keep more of the money you earn.`}
          </Text>
          <Button
            variant="gradient"
            gradient={{ from: "#3077F3", to: "#15AABF" }}
            className={classes.button}
            onClick={navigateToForm}
          >{`Book a Demo Call`}</Button>
        </Center>
      </BackgroundImage>
    </Container>
  );
};
