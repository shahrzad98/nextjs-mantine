import withAuth from "@/common/withAuth";
import { AttendeeSettings } from "@/modules";

import { NovelTHead, NVTLayout } from "@/components";

function MyAccount() {
  return (
    <NVTLayout
      activeLink="/my-account"
      backgroundGradientVariant={11}
      navbarProps={{ emailConfirmationBanner: "myAccount", currentPageTitle: "My Account" }}
    >
      <NovelTHead title="My account" />
      <AttendeeSettings />
    </NVTLayout>
  );
}

export default withAuth(MyAccount);
