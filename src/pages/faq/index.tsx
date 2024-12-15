import { FAQsContent } from "@/modules";
import React from "react";

import { NVTLayout, NovelTHead } from "@/components";

const Faq = () => {
  return (
    <NVTLayout backgroundGradientVariant={5}>
      <NovelTHead title="FAQs" />
      <FAQsContent />
    </NVTLayout>
  );
};

export default Faq;
