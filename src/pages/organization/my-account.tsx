import withAuth from "@/common/withAuth";
import { OrganizerSettings } from "@/modules";
import React from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function OrganizerAccountSettings() {
  return (
    <OrganizerDashboardLayout
      navbarProps={{ currentPageTitle: "My Account", background: "none" }}
      hasFooter={false}
    >
      <NovelTHead title="My Account" />
      <OrganizerSettings />
    </OrganizerDashboardLayout>
  );
}

export default withAuth(OrganizerAccountSettings);
