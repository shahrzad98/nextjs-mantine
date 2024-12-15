import { TicketingAgreementContent, TopTitle } from "@/modules";
import { Box } from "@mantine/core";
import React from "react";

import { NovelTHead, NVTLayout } from "@/components";

const TicketingAgreement = () => {
  return (
    <NVTLayout navbarProps={{ background: "none" }} backgroundGradientVariant={5}>
      <NovelTHead title="Ticketing Services Agreement" />
      <Box mt={-78}>
        <TopTitle pageName="Ticketing Services Agreement" />
        <TicketingAgreementContent />
      </Box>
    </NVTLayout>
  );
};

export default TicketingAgreement;
