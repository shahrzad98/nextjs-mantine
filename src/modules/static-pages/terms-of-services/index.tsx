import { Flex, createStyles, rem } from "@mantine/core";
import React from "react";

import AcceptingText from "./termsText/acceptingText";
import BeginningText from "./termsText/beginingText";
import ChangeTerms from "./termsText/changeTerms";
import DefinitionText from "./termsText/definitionText";
import NvtRights from "./termsText/nvtRights";
import ProhibitedTerms from "./termsText/prohibited";

const useStyles = createStyles((theme) => ({
  TextWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: rem(30),
    padding: "10px 150px",
    fontSize: rem(16),
    marginBottom: rem(66),
    [theme.fn.smallerThan("sm")]: {
      padding: "8px 37px",
      fontSize: rem(14),
      gap: rem(20),
    },
  },
}));

export const TermsText = () => {
  const { classes } = useStyles();

  return (
    <Flex className={classes.TextWrapper}>
      <BeginningText />
      <DefinitionText />
      <AcceptingText />
      <ChangeTerms />
      <ProhibitedTerms />
      <NvtRights />
    </Flex>
  );
};
