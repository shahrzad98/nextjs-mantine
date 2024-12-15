import { Flex, Text, createStyles, rem } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  container: {
    flexDirection: "column",
    gap: rem(50),
    [theme.fn.smallerThan("sm")]: {
      gap: rem(30),
    },
  },
  title: {
    fontSize: rem(40),
    lineHeight: rem(30),
    fontWeight: 600,
    color: "#E981FA",
    textAlign: "center",
    margin: "0 auto",
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(28),
    },
  },
}));

const WhyNovelt = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.container}>
      <Text className={classes.title}>{`Why novelT?`}</Text>
      <Text fz={rem(16)} lh={rem(28)} color="rgba(255, 255, 255, 0.80)">
        {`Driven by our passion to create seamless live experiences, novelT was built to revolutionize the event ticketing industry; making it easier for people to access the events they love.`}
        <br />
        <br />
        {`Whether you're planning a large-scale concert or a small community gathering, novelT is here to help you sell your tickets effortlessly. With ethical pricing and a user-friendly platform, we're dedicated to delivering the best possible ticket buying experience.`}
        <br />
        <br />
        {`Our streamlined purchasing process system delivers virtual tickets straight to your customer's phone, saving them the hassle of having to print them out. With novelT, you will enjoy a stress-free ticketing experience from start to finish.`}
      </Text>
    </Flex>
  );
};

export default WhyNovelt;
