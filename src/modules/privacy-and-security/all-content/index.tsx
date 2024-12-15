import { TopTitle } from "@/modules";
import { Box } from "@mantine/core";
import React from "react";

import PrivacySecurityText from "../privacy-text";

export const AllContent = () => {
  return (
    <Box mt={-78}>
      <TopTitle pageName="Privacy & Security" />
      <PrivacySecurityText />
    </Box>
  );
};
