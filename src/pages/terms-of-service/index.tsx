import { TermsText, TopTitle } from "@/modules";
import { Box } from "@mantine/core";
import React from "react";

import { NovelTHead, NVTLayout } from "@/components";

const TermsOfServices = () => {
  return (
    <NVTLayout navbarProps={{ background: "none" }} backgroundGradientVariant={5}>
      <NovelTHead title="Term Of Services" />
      <Box mt={-78}>
        <TopTitle pageName="NOVELT Inc Terms and conditions" breadcrumb="Terms of Service" />
        <TermsText />
      </Box>
    </NVTLayout>
  );
};

export default TermsOfServices;
