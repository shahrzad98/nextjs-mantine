import withAuth from "@/common/withAuth";
import { OrganizationSettings } from "@/modules";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function OrganizationSettingsPage() {
  return (
    <OrganizerDashboardLayout
      navbarProps={{ currentPageTitle: "Organization Settings", background: "none" }}
      hasFooter={false}
    >
      <NovelTHead title="Settings" />
      <OrganizationSettings />
    </OrganizerDashboardLayout>
  );
}

export default withAuth(OrganizationSettingsPage);
