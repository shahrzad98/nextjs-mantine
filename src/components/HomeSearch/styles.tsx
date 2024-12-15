import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  dateItems: {
    padding: "8px 12px",
    borderRadius: 4,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.colors.dark[4],
    },
  },
  resetButton: {
    color: theme.colors.nvtPrimary[2],
    fontSize: theme.fontSizes.md,
  },
  resultSection: {
    width: "100%",
    padding: "1.75rem 2.75rem 1.25rem 2.75rem",
    gap: 0,
    "&:first-of-type": {
      borderBottom: "1px solid #373A3F",
    },
    [`@media (max-width: 481px)`]: {
      padding: "1.25rem",
    },
  },
  resultSectionTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.lg,
    "font-weight": "400",
    [theme.fn.smallerThan("sm")]: {
      fontSize: 14,
    },
    span: {
      color: "rgba(255, 255, 255, 0.3)",
    },
  },
  searchButton: {
    background: `linear-gradient(45deg, ${theme.colors.nvtPrimary[2]} 0%, ${theme.colors.nvtPrimary[1]} 100%)`,
    borderRadius: "0px 4px 4px 0px",
    padding: "0 12px",
    height: 49,
    "font-weight": "400",
  },
  customScrollbar: {
    "&::-webkit-scrollbar": {
      height: "0.5rem",
      width: "0.5rem",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0,0,0,0.05)",
      outline: "none",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#373A3F",
      outline: "none",
    },
  },
}));
