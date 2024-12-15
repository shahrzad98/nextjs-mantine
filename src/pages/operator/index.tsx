import withAuth from "@/common/withAuth";
import { OperatorDashboardModule } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function OperatorDashboard() {
  const router = useRouter();
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser?.data?.role === "admin" || currentUser?.data?.role === "owner") {
      router.push("/organization");
    } else if (currentUser?.data?.role !== "operator") {
      router.push("/");
    } else {
      setMounted(true);
    }
  }, [router.isReady, setMounted]);

  return router.isReady && mounted ? (
    <OrganizerDashboardLayout navbarProps={{ currentPageTitle: "My Events" }}>
      <NovelTHead title="My Events" />
      <OperatorDashboardModule />
    </OrganizerDashboardLayout>
  ) : (
    <></>
  );
}

export default withAuth(OperatorDashboard);
