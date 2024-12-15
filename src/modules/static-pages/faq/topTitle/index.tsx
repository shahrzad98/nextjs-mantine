import { Flex, Text, createStyles, rem } from "@mantine/core";
import Link from "next/link";
import React from "react";

const useStyles = createStyles((theme) => ({
  topWrapper: {
    padding: "50px 100px",
    justifyContent: "space-between",

    [theme.fn.smallerThan("sm")]: {
      padding: "28px 30px",
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
  activeBreadcrumbs: {
    display: "flex",
    flexDirection: "row",
    gap: rem(8),
    color: "#FFFFFFCC",
    textDecoration: "none",
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  topText: {
    fontSize: rem(24),
    fontWeight: 500,
    color: "#FFFFFFCC",
    [theme.fn.smallerThan("md")]: {
      fontSize: rem(18),
    },
  },
  topTextSm: {
    fontSize: rem(24),
    fontWeight: 500,
    color: "#FFFFFFCC",
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));

const TopTitle = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.topWrapper}>
      <Flex direction="row" gap={0}>
        <Text className={classes.topText}>{`Frequently Asked Questions`}</Text>
        <Text className={classes.topTextSm}>{`(FAQs)`}</Text>
      </Flex>
      <Flex className={classes.breadcrumbs}>
        <Link href="/" className={classes.breadcrumbs}>
          Home
        </Link>
        <Text>/</Text>
        <Link href="" className={classes.activeBreadcrumbs}>
          {`Frequently Asked Questions`}
        </Link>
      </Flex>
    </Flex>
  );
};

export default TopTitle;
