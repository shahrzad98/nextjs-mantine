import withAuth from "@/common/withAuth";
import { PromoterSettings } from "@/modules";
import React from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function PromoterAccountSettings() {
  return (
    <OrganizerDashboardLayout
      navbarProps={{ currentPageTitle: "My Account", background: "none" }}
      hasFooter={false}
    >
      <NovelTHead title="My Account" />
      <PromoterSettings />
    </OrganizerDashboardLayout>
  );
}

export default withAuth(PromoterAccountSettings);
