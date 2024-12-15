import { BackgroundImage, Box, Flex, Text, createStyles, rem } from "@mantine/core";
import Link from "next/link";
import React from "react";

const useStyles = createStyles((theme) => ({
  textWrapper: {
    width: rem(350),
    display: "flex",
    flexDirection: "column",
    gap: rem(20),
    justifyContent: "center",
    paddingLeft: rem(35),
    paddingRight: rem(30),
    letterSpacing: "-0.02em",
    margin: "50px 0",
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      padding: rem(29),
    },
  },
  bottomWrapper: {
    flexDirection: "row",
    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column-reverse",
    },
  },
  pictureWrapper: {
    width: "60%",
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      height: rem(224),
    },
  },
  picture: {
    height: rem(538),
    [theme.fn.smallerThan("sm")]: {
      height: rem(224),
    },
  },
}));

export const ContactUsBottom = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.bottomWrapper}>
      <Box className={classes.pictureWrapper}>
        <BackgroundImage src={"./img/contact-us/happy-call.png"} className={classes.picture} />
      </Box>
      <Flex className={classes.textWrapper}>
        <Text fz={16} color="rgba(255, 255, 255, 0.8)">
          We understand that your time is valuable which is why our customer support team is
          available <span style={{ color: "#E981FA" }}> 24/7</span> {``}
          to help you with all your technological needs. For inquiries, our team strives to respond
          within 24 hours ensuring fast and easy communication.
        </Text>
        <Text
          sx={{
            a: {
              color: "#A7DBEE",
              textDecoration: "none",
            },
          }}
        >
          Thank you for choosing <Link href="/">novelT</Link>!
        </Text>
      </Flex>
    </Flex>
  );
};
