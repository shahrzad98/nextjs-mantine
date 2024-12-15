import { createStyles, rem } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  footer: {
    paddingTop: 51,
    [theme.fn.smallerThan("sm")]: {
      paddingTop: 20,
      paddingBottom: 10,
    },
    backgroundColor: theme.colors.nvtPrimary[5],
  },

  logo: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  mobileLogo: {
    padding: "0 1.5rem",
    marginBottom: rem(50),
    [theme.fn.largerThan("sm")]: {
      padding: "0 1rem",
    },
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  description: {
    marginTop: rem(17),
    fontSize: rem(10),
    fontWeight: 400,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: rem(1181),

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },

  groups: {
    display: "flex",
    flexWrap: "wrap",

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  wrapper: {
    width: rem(160),
  },

  link: {
    display: "block",
    color: "rgba(255, 255, 255, 0.50)",
    fontSize: theme.fontSizes.sm,
    paddingBottom: rem(8),
    textDecoration: "none",
  },

  linkActive: {
    color: theme.colors.indigo[4],
  },

  title: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: rem(28),
    color: "rgba(255, 255, 255, 0.80)",
  },

  afterFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: rem(1181),
    marginTop: 36,
    paddingTop: theme.spacing.xl,
    [theme.fn.smallerThan("sm")]: {
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 50,
    },
  },

  social: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,
    },
  },

  socialIcon: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6],
  },

  brandName: {
    color: "#A7DBEE",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));
