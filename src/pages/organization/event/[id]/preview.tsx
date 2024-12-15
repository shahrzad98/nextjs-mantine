import { getEvent } from "@/api/handler";
import withAuth from "@/common/withAuth";
import { EventModule } from "@/modules";
import { IMyEvent } from "@/types";
import { isHttpError } from "@/types/http";
import { errorNotification } from "@/utils";
import { eventKey } from "@/utils/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";

import { NovelTHead, NVTLayout } from "@/components";

const EventShow: FC = () => {
  const {
    query: { id },
  } = useRouter();
  const queryClient = useQueryClient();
  const {
    data: eventData,
    isSuccess,
    error,
  } = useQuery([eventKey(id as string)], () => getEvent(id as string).then((res) => res.data), {
    initialData: queryClient.getQueryData([eventKey(id as string)]),
    enabled: !!id,
  });

  useEffect(() => {
    isHttpError(error) && errorNotification(error);
  }, [error]);

  return (
    <NVTLayout navbarProps={{ background: "none", currentPageTitle: "Preview" }}>
      <NovelTHead title={eventData?.name as string} />
      <EventModule eventData={eventData as IMyEvent} isSuccess={isSuccess} />
    </NVTLayout>
  );
};
export default withAuth(EventShow);
