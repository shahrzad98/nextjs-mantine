import withAuth from "@/common/withAuth";
import { PromoterEventList } from "@/modules";
import { useRouter } from "next/router";
import React from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function Events() {
  const router = useRouter();

  return (
    <OrganizerDashboardLayout
      navbarProps={{
        background: "none",
        currentPageTitle: "My Events",
      }}
    >
      <NovelTHead title="My Events" />
      {router.isReady && <PromoterEventList collapsed />}
    </OrganizerDashboardLayout>
  );
}

export default withAuth(Events);
