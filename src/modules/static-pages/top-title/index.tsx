import { useBreakpoint } from "@/hooks";
import { Flex, Text, createStyles, rem } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const useStyles = createStyles((theme) => ({
  topWrapper: {
    padding: "40px 50px 40px 100px",
    justifyContent: "space-between",
    paddingTop: rem(100),

    [theme.fn.smallerThan("sm")]: {
      padding: "20px 30px",
      paddingTop: rem(100),
    },
  },
  breadcrumbs: {
    display: "flex",
    flexDirection: "row",
    gap: rem(8),
    color: "rgba(255, 255, 255, 0.50)",
    textDecoration: "none",
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  active: {
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.80)",
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  topText: {
    color: "rgba(255,255,255,0.80)",
    fontSize: rem(24),
    fontWeight: 500,
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },
}));

export interface ITopTitleProps {
  pageName: string;
  breadcrumb?: string;
}

export const TopTitle = ({ pageName, breadcrumb }: ITopTitleProps) => {
  const { classes } = useStyles();
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  return (
    <Flex className={classes.topWrapper}>
      <Text className={classes.topText}>{isMobile ? breadcrumb : pageName}</Text>
      <Flex className={classes.breadcrumbs}>
        <Link href="/" className={classes.breadcrumbs} onClick={() => router.push("/")}>
          Home
        </Link>
        <Text>/</Text>
        <Link href="" className={classes.active}>
          {breadcrumb || pageName}
        </Link>
      </Flex>
    </Flex>
  );
};
