import { getEvent } from "@/api/handler";
import withAuth from "@/common/withAuth";
import { OperatorScannerModule } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { eventKey } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function TicketInspectorEventScanner() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const currentUser = userStore((state: IUserStore) => state.currentUser);

  useEffect(() => {
    if (currentUser?.role !== UserType.Organizer) {
      router.push("/");
    } else {
      setMounted(true);
    }
  }, [router.isReady, setMounted]);

  const { id } = router.query;

  const {
    data: eventData,
    isSuccess: isEventDataSuccess,
    isLoading: isEventDataLoading,
    error: eventDataError,
  } = useQuery([eventKey(id as string)], () => getEvent(id as string).then((res) => res.data), {
    initialData: queryClient.getQueryData([eventKey(id as string)]),
    enabled: !!id,
  });

  return router.isReady && mounted ? (
    <OrganizerDashboardLayout hasFooter={false} activeBreadCrumb={eventData?.name}>
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

export default withAuth(TicketInspectorEventScanner);
