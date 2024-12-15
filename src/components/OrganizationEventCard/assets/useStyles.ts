import { createStyles, rem } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  image: {
    height: "100%",
    position: "relative",
    [theme.fn.largerThan("md")]: {
      maxHeight: rem(192),
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },

  badge: {
    fontWeight: 500,
  },

  dropdownItem: {
    svg: {
      color: theme.colors.nvtPrimary[2],
    },
  },

  title: {
    color: "#ffffff",
    [theme.fn.smallerThan("md")]: {
      fontSize: rem(16),
      height: "calc(1rem * 1.35 * 2)",
      color: "rgba(255, 255, 255, 0.80)",
    },
  },

  desktopDateTime: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  mobileDateTime: {
    [theme.fn.smallerThan("md")]: {
      fontSize: rem(10),
    },
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));
