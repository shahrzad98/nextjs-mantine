import { useBreakpoint } from "@/hooks";
import { BackgroundImage, Center, Flex, Text, createStyles, rem } from "@mantine/core";
import Link from "next/link";
import React from "react";

import { AboutUsData } from "../assets/aboutUsData";

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },
  link: {
    textDecoration: "none",
    width: "calc(100% / 3)",
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));
export const AboutUsBottom = () => {
  const { classes } = useStyles();
  const { isMobile } = useBreakpoint();

  return (
    <Flex className={classes.wrapper}>
      {AboutUsData.map((section, i) => {
        return (
          <Link href={section.href} className={classes.link} key={i}>
            {" "}
            {/* removed target from link */}
            <BackgroundImage src={section.image}>
              <Center h={rem(isMobile ? 278 : 367)}>
                <Text fz={rem(isMobile ? 16 : 20)} lh={rem(30)} fw="bold" color="#FFFFFF">
                  {section.text}
                </Text>
              </Center>
            </BackgroundImage>
          </Link>
        );
      })}
    </Flex>
  );
};
