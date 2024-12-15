import { ContactUsBottom, ContactUsMiddle, ContactUsTop } from "@/modules";
import React from "react";

import { NovelTHead, NVTLayout } from "@/components";

const Contact = () => {
  return (
    <NVTLayout navbarProps={{ background: "none" }} backgroundGradientVariant={5}>
      <NovelTHead title="Contact Us" />
      <ContactUsTop />
      <ContactUsMiddle />
      <ContactUsBottom />
    </NVTLayout>
  );
};

export default Contact;
