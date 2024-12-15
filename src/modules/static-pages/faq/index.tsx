import { TopTitle } from "@/modules";
import { Box } from "@mantine/core";
import React from "react";

import FaqText from "./faq-text";

export const FAQsContent = () => {
  return (
    <Box mt={-78}>
      <TopTitle
        pageName="Frequently Asked Questions (FAQs)"
        breadcrumb="Frequently Asked Questions "
      />
      <FaqText />
    </Box>
  );
};
