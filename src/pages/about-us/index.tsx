import { AboutUsBottom, AboutUsMiddle, AboutUsTop } from "@/modules";
import { Flex } from "@mantine/core";
import React from "react";

import { NovelTHead, NVTLayout } from "@/components";

const aboutUs = () => {
  return (
    <>
      <NVTLayout navbarProps={{ background: "none" }} backgroundGradientVariant={5}>
        <NovelTHead title="About Us" />
        <AboutUsTop />
        <Flex direction="column" align="center">
          <AboutUsMiddle />
          <AboutUsBottom />
        </Flex>
      </NVTLayout>
    </>
  );
};

export default aboutUs;
