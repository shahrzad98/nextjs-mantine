import { Button, Flex, Text, createStyles, rem } from "@mantine/core";
import Image from "next/image";
import React from "react";

const useStyles = createStyles((theme) => ({
  topWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "88vh",
    position: "relative",
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(165),
      minHeight: "70vh",
    },
  },
  bottomText: {
    fontSize: rem(20),
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(14),
      marginTop: rem(10),
    },
  },
  picWrapper: {
    width: rem(468),
    height: rem(266),
    position: "relative",
    [theme.fn.smallerThan("sm")]: {
      width: rem(285),
      height: rem(118),
    },
  },
}));

const ErrorContent = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.topWrapper}>
      <Flex className={classes.picWrapper}>
        <Image src={"/img/404/404.svg"} fill style={{ objectFit: "contain" }} alt="404 Error" />
      </Flex>
      <Text
        variant="gradient"
        gradient={{ from: "#3077F3", to: "#88009E", deg: 45 }}
        className={classes.bottomText}
      >
        The page you are looking for does not exist !
      </Text>
      <Button
        variant="default"
        sx={{
          background: "#1A1B1E",
          border: "none",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: -1,
            margin: -1,
            borderRadius: "inherit",
            background: "linear-gradient(45deg, #1971c2, #0c8599)",
          },
        }}
        mt={rem(38)}
        onClick={() => (window.location.href = "/")}
      >
        <Text variant="gradient" gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}>
          Go back Home
        </Text>
      </Button>
    </Flex>
  );
};

export default ErrorContent;
