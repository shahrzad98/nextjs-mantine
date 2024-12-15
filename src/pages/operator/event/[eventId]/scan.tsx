import { getEvent } from "@/api/handler";
import withAuth from "@/common/withAuth";
import { OperatorScannerModule } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore } from "@/types";
import { eventKey } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function OperatorEventScanner() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const currentUser = userStore((state: IUserStore) => state.currentUser);

  useEffect(() => {
    if (currentUser?.data?.role === "admin" || currentUser?.data?.role === "owner") {
      router.push("/organization");
    } else if (currentUser?.data?.role !== "operator") {
      router.push("/");
    } else {
      setMounted(true);
    }
  }, [router.isReady, setMounted]);

  const { eventId } = router.query;

  const {
    data: eventData,
    isSuccess: isEventDataSuccess,
    isLoading: isEventDataLoading,
    error: eventDataError,
  } = useQuery(
    [eventKey(eventId as string)],
    () => getEvent(eventId as string).then((res) => res.data),
    {
      initialData: queryClient.getQueryData([eventKey(eventId as string)]),
      enabled: !!eventId,
    }
  );

  return router.isReady && mounted ? (
    <OrganizerDashboardLayout activeBreadCrumb={eventData?.name}>
      <NovelTHead title={`${eventData?.name} | Scan`} />
      {isEventDataSuccess && (
        <OperatorScannerModule
          eventData={eventData}
          isEventDataSuccess={isEventDataSuccess}
          isEventDataLoading={isEventDataLoading}
          eventDataError={eventDataError}
        />
      )}
    </OrganizerDashboardLayout>
  ) : (
    <></>
  );
}

export default withAuth(OperatorEventScanner);
