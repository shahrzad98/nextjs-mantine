import { createStyles, rem } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 2,
    background: "none",
    border: "none",
    transition: "0.3s",
  },

  filled: {
    background: theme.colors.nvtPrimary[5],
    [theme.fn.smallerThan("md")]: {
      background: "none",
    },
  },

  sticky: {
    position: "fixed",
    top: "0",
    background: theme.colors.nvtPrimary[5],
    [theme.fn.smallerThan("md")]: {
      background: theme.colors.nvtPrimary[7],
    },
  },

  dropdown: {
    height: "100%",
    position: "fixed",
    background: theme.colors.nvtPrimary[5],
    zIndex: 999,
    top: 0,
    left: 0,
    right: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",
    padding: rem(20),

    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    gridGap: `0 ${rem(10)}`,
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  close: {
    position: "absolute",
    top: rem(25),
    right: "1rem",
  },

  link: {
    height: rem(45),
    display: "flex",
    alignItems: "center",
    padding: rem(10),
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.70)",
    fontSize: theme.fontSizes.sm,
    fontWeight: 400,

    svg: {
      color: theme.colors.nvtPrimary[0],
      marginRight: rem(10),
      display: "none",
    },

    "&:hover": {
      color: theme.colors.nvtPrimary[2],
      textDecoration: "underline",
    },

    [theme.fn.smallerThan("md")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkWithIcon: {
    svg: {
      display: "flex",
    },
  },

  linkActive: {
    "&, &:hover": {
      color: theme.colors.nvtPrimary[2],
    },
  },

  linkActiveWithBackground: {
    "&, &:hover": {
      backgroundColor: theme.colors.nvtPrimary[6],
    },
  },

  button: {
    height: rem(45),
    fontSize: rem(14),
    color: "rgba(255, 255, 255, 0.70)",
    svg: {
      color: theme.colors.nvtPrimary[0],
    },
  },

  search: {
    input: {
      border: "none",
      height: rem(45),
      borderRadius: "6px",
    },
  },

  back: {
    fontWeight: 500,
    background: "none",
    border: "none",
    justifyContent: "flex-start",
    color: "rgba(255, 255, 255, 0.80)",

    "&:hover": {
      background: "none",
    },
  },
}));
