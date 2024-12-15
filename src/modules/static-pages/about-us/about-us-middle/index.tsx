import { Flex, Text, createStyles, rem } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    maxWidth: 1038,
    display: "flex",
    flexDirection: "column",
    justifyItems: "center",
    alignItems: "center",
    gap: rem(50),
    letterSpacing: "-0.02em",
    margin: "88px auto",
    padding: `0 ${rem(29)}`,

    [theme.fn.smallerThan("sm")]: {
      gap: rem(30),
      margin: "52px auto",
    },
  },
  title: {
    color: "#E981FA",
    fontSize: rem(40),
    fontWeight: 600,
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(28),
    },
  },
}));

export const AboutUsMiddle = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.wrapper}>
      <Text className={classes.title}>Who We Are</Text>
      <Text ta="center" color="rgba(255, 255, 255, 0.80)">
        At novelT, we believe that life is all about creating unforgettable moments and sharing them
        with the world. Our event ticketing platform is designed to make it easier for you to
        experience all of life&apos;s exciting adventures and special moments. Whether you&apos;re
        looking for tickets to the hottest concerts, sporting events, or theater shows, we have you
        covered. Our platform is user-friendly, reliable, and efficient, allowing you to purchase
        tickets with ease. Join us on our mission to help you create unforgettable memories and
        share them with the world. Start using novelT today!
      </Text>
    </Flex>
  );
};
