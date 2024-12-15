import { AllContent } from "@/modules/privacy-and-security";
import React from "react";

import { NVTLayout, NovelTHead } from "@/components";

const privecySecurity = () => {
  return (
    <NVTLayout navbarProps={{ background: "none" }} backgroundGradientVariant={5}>
      <NovelTHead title="Privacy & Policy" />
      <AllContent />
    </NVTLayout>
  );
};

export default privecySecurity;
