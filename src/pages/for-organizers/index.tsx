import {
  ForOrganizersCreateEvents,
  ForOrganizersFaq,
  ForOrganizersMiddleSection,
  ForOrganizersTopSection,
} from "@/modules";
import React from "react";

import { NovelTHead, NVTLayout } from "@/components";

const ForOrganizers = () => {
  return (
    <NVTLayout
      navbarProps={{ background: "none" }}
      activeLink="/for-organizers"
      backgroundGradientVariant={6}
    >
      <NovelTHead title="For Organizers" />
      <ForOrganizersTopSection />
      <ForOrganizersMiddleSection />
      <ForOrganizersCreateEvents />
      <ForOrganizersFaq />
    </NVTLayout>
  );
};

export default ForOrganizers;
