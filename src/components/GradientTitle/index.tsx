import { createStyles, Title, TitleProps } from "@mantine/core";
import React, { FC, PropsWithChildren } from "react";

const useStyles = createStyles(() => ({
  root: {
    "h1, h2, h3, h4, h5, h6": {
      background: `linear-gradient(to right, #3077F3 0%, #BC3CD1 40%)`,
      "-webkit-background-clip": "text",
      "-webkit-text-fill-color": "transparent",
    },
  },
}));
export const GradientTitle: FC<PropsWithChildren<TitleProps>> = ({ children, ...args }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Title {...args}>{children}</Title>
    </div>
  );
};
