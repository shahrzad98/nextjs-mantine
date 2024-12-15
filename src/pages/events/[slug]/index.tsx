import { getAttendeeEvents } from "@/api/handler";
import { useInfiniteScroll } from "@/hooks";
import { EventsModule } from "@/modules";
import { titleDictionary } from "@/modules/events/constant";
import userStore from "@/stores/userStore";
import { IUserStore } from "@/types";
import { eventsKey } from "@/utils/queryKeys";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { NovelTHead, NVTLayout } from "@/components";

const AttendeeEvents = () => {
  const {
    query: { slug },
  } = useRouter();

  const currentUser = userStore((state: IUserStore) => state.currentUser);

  const [lat, setLat] = useState<number | null | undefined>(null);
  const [lng, setLng] = useState<number | null | undefined>(null);

  useEffect(() => {
    if (currentUser?.data?.lat && currentUser?.data?.lng) {
      setLat(currentUser?.data?.lat);
      setLng(currentUser?.data?.lng);
    } else {
      const successCallback = (position: GeolocationPosition) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      };

      const errorCallback = () => {
        setLat(undefined);
        setLng(undefined);
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
  }, [currentUser]);

  const infiniteData = useInfiniteScroll({
    enabled: !!slug && (slug === "nearby-events" ? lat !== null && lng !== null : true),
    queryKey: [eventsKey(slug as string)],
    queryFn: ({ pageParam = 1 }) =>
      getAttendeeEvents(
        slug as string,
        pageParam,
        slug === "top-events" ? 9 : 6,
        lat as number | undefined,
        lng as number | undefined
      ),
  });

  return (
    <>
      <NVTLayout
        navbarProps={{ background: "none", currentPageTitle: titleDictionary[slug as string] }}
        backgroundGradientVariant={1}
      >
        <NovelTHead title={titleDictionary[slug as string]} />
        <EventsModule slug={slug as string} {...infiniteData} />
      </NVTLayout>
    </>
  );
};

export default AttendeeEvents;
