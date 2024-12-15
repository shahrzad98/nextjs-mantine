import withAuth from "@/common/withAuth";
import { OperatorDashboardModule } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function OrganizerTicketInspector() {
  const router = useRouter();
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser?.role !== UserType.Organizer) {
      router.push("/");
    } else {
      setMounted(true);
    }
  }, [router.isReady, setMounted]);

  return router.isReady && mounted ? (
    <OrganizerDashboardLayout
      hasFooter={false}
      navbarProps={{ currentPageTitle: "Ticket Inspector" }}
    >
      <NovelTHead title="Ticket Inspector" />
      <OperatorDashboardModule />
    </OrganizerDashboardLayout>
  ) : (
    <></>
  );
}

export default withAuth(OrganizerTicketInspector);
