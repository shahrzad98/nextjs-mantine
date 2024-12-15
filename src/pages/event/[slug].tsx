import { getGuestToken } from "@/api/handler";
import { getAttendeeEvent } from "@/api/handler/event";
import getLocalStorageValue from "@/helpers/getLocalStorageValue";
import { EventModule } from "@/modules";
import userStore from "@/stores/userStore";
import { ICurrentUserStorage, IGuestToken, IMyEvent } from "@/types";
import { isHttpError } from "@/types/http";
import { errorNotification } from "@/utils";
import { eventKey } from "@/utils/queryKeys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";

import { NovelTHead, NVTLayout } from "@/components";

const EventShow: FC = () => {
  const {
    query: { slug, promoter },
  } = useRouter();

  const {
    data: eventData,
    isSuccess,
    error,
  } = useQuery(
    [eventKey(slug as string)],
    () =>
      getAttendeeEvent(slug as string, promoter ? String(promoter) : null).then((res) => res.data),
    {
      keepPreviousData: false,
      refetchOnMount: "always",
      enabled: !!slug,
    }
  );

  const storeToken = userStore((store) => store?.currentUser?.token);

  const { mutate: handleGuestToken } = useMutation(() => getGuestToken(), {
    onSuccess: (res) => {
      localStorage.setItem("guest-token", JSON.stringify(res.data));
    },
    onError: (e: AxiosError) => {
      errorNotification(e);
    },
  });

  useEffect(() => {
    const localGuestToken = getLocalStorageValue<IGuestToken>("guest-token");
    const localStorageToken =
      getLocalStorageValue<ICurrentUserStorage>("nvt-user-storage")?.state?.currentUser?.token;

    if (!localGuestToken && !localStorageToken && !storeToken) {
      handleGuestToken();
    }
  }, []);

  useEffect(() => {
    if (promoter && isSuccess) {
      localStorage.setItem(`event-${eventData?.id}`, promoter as string);
    }
  }, [promoter, isSuccess, eventData]);

  useEffect(() => {
    isHttpError(error) && errorNotification(error);
  }, [error]);

  return (
    <NVTLayout
      navbarProps={{ background: "none", currentPageTitle: eventData?.name }}
      backgroundGradientVariant={7}
    >
      <NovelTHead title={eventData?.name as string} />
      <EventModule eventData={eventData as IMyEvent} isSuccess={isSuccess} />
    </NVTLayout>
  );
};
export default EventShow;
