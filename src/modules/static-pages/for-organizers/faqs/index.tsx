import { BackgroundImage, Box, Button, Flex, Text, createStyles, rem } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";

const useStyles = createStyles((theme) => ({
  textWrapper: {
    display: "flex",
    flexDirection: "column",
    width: rem(324),
    gap: rem(40),
    justifyContent: "center",
    letterSpacing: "-0.02em",
    marginRight: rem(35),
    [theme.fn.smallerThan("sm")]: {
      padding: rem(27),
      gap: rem(30),
      margin: "20px auto",
      width: "100%",
    },
  },
  fullContainer: {
    flexDirection: "row",
    paddingLeft: rem(16),
    justifyContent: "end",
    gap: rem(14),
    margin: "auto",
    [theme.fn.smallerThan("sm")]: {
      paddingLeft: 0,
      flexDirection: "column",
    },
  },
  pictureWrapper: {
    width: "60%",

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
  title: {
    fontSize: rem(40),
    fontWeight: 600,
    color: "#E981FA",
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(28),
      textAlign: "center",
    },
  },
  button: {
    fontSize: rem(15),
    fontWeight: 400,
    width: rem(120),
    height: rem(44),
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
  background: {
    height: rem(538),
    [theme.fn.smallerThan("sm")]: {
      height: rem(280),
    },
  },
}));

export const ForOrganizersFaq = () => {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Flex className={classes.fullContainer}>
      <Flex className={classes.textWrapper}>
        <Text className={classes.title}>FAQs</Text>
        <Text fz={16} color="#FFFFFFCC">
          {`Have a question? We are here to assist you in any way we can. Click the link below to view
          our list of support questions and answers or to connect with our support team.`}
        </Text>
        <Button
          variant="gradient"
          gradient={{ from: "#3077F3", to: "#15AABF" }}
          className={classes.button}
          onClick={() => router.push("faq")}
        >
          Get Answers
        </Button>
      </Flex>
      <Box className={classes.pictureWrapper}>
        <BackgroundImage
          src={"./img/for-organizer/happy-service.png"}
          className={classes.background}
        />
      </Box>
    </Flex>
  );
};
