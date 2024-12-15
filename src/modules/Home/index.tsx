import { attendeeVerifyEmail } from "@/api/handler";
import { getHomeEvents } from "@/api/handler/home-events";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { CustomErrorResponse, isHttpError } from "@/types/http";
import { errorNotification, successNotification } from "@/utils";
import { eventsKey } from "@/utils/queryKeys";
import { Container, Flex, rem, Text } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { HomeEventCarousel, HomeSearch, NovelTHead, NVTLayout } from "@/components";

import { EventList } from "./EventList";

export function Home() {
  const { isMobile } = useBreakpoint();

  const { isReady, query, replace } = useRouter();

  const { token } = query;

  const queryClient = useQueryClient();

  const setUser = userStore((state: IUserStore) => state.setUser);
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

  const {
    data: topEvents,
    isSuccess: isTopEventsSuccess,
    isLoading: isTopEventsLoading,
    error: topEventsError,
  } = useQuery(
    [eventsKey("top-events")],
    () => getHomeEvents({ event_type: "top", per_page: 3, page: 1 }).then((res) => res.data),
    {
      initialData: queryClient.getQueryData([eventsKey("top-events")]),
    }
  );

  const {
    data: upcomingEvents,
    isSuccess: isUpcomingEventsSuccess,
    isLoading: isUpcomingEventsLoading,
    error: upcomingEventsError,
  } = useQuery(
    [eventsKey("upcoming-events")],
    () => getHomeEvents({ event_type: "upcoming", per_page: 3, page: 1 }).then((res) => res.data),
    {
      initialData: queryClient.getQueryData([eventsKey("upcoming-events")]),
    }
  );

  const {
    data: nearbyEvents,
    isSuccess: isNearbyEventsSuccess,
    isLoading: isNearbyEventsLoading,
    error: nearbyEventsError,
  } = useQuery(
    [eventsKey("nearby-events")],
    () =>
      getHomeEvents({
        event_type: "nearby",
        per_page: 3,
        page: 1,
        lat: lat as number | undefined,
        lng: lng as number | undefined,
      }).then((res) => res.data),
    {
      enabled: lat !== null && lng !== null,
      initialData: queryClient.getQueryData([eventsKey("nearby-events")]),
    }
  );

  const { mutate: handleEmailVerification } = useMutation(
    (token: string) => attendeeVerifyEmail(token),
    {
      onSuccess: (res) => {
        setUser({
          token: currentUser?.token as string,
          refreshToken: currentUser?.refreshToken as string,
          apiTokenExpiry: currentUser?.apiTokenExpiry as string,
          expiry: currentUser?.expiry as number,
          role: currentUser?.role as UserType,
          data: { ...currentUser?.data, email_confirmed_at: res.data.email_confirmed_at },
        });
        successNotification({
          title: "Success!",
          message: "Your email was successfully verified",
        });
      },
      onError: (e: AxiosError<CustomErrorResponse>) => {
        errorNotification(e);
      },
    }
  );

  useEffect(() => {
    if (token) {
      handleEmailVerification(token as string);
      replace("/", undefined, { shallow: true });
    }
  }, [token]);

  useEffect(() => {
    [upcomingEventsError, nearbyEventsError, topEventsError].forEach((error) => {
      isHttpError(error) && errorNotification(error);
    });
  }, [upcomingEventsError, nearbyEventsError, topEventsError]);

  return (
    <NVTLayout navbarProps={{ background: "none" }} backgroundGradientVariant={1}>
      <NovelTHead title="Home" />
      <Container size={!isMobile ? rem(1042) : "xs"}>
        <Flex mih={isMobile ? rem(280) : rem(350)} justify="center" direction="column" px={10}>
          <Text
            mb={isMobile ? rem(10) : rem(48)}
            align="center"
            size={isMobile ? rem(24) : rem(40)}
            lh={rem(30)}
            weight="600"
            color="rgba(255, 255, 255, 0.8)"
          >
            Discover Events
          </Text>
          {isReady && <HomeSearch />}
        </Flex>
        <Flex direction="column" mb={isMobile ? rem(60) : undefined} mt={rem(-30)}>
          {isTopEventsSuccess ? (
            isMobile ? (
              <Flex my={rem(40)} direction="column">
                <Text
                  size={rem(16)}
                  lts="-0.04em"
                  lh={rem(30)}
                  mb={rem(10)}
                  mx="1rem"
                  weight={isMobile ? 500 : 400}
                  color="gray.4"
                >
                  Top Events
                </Text>

                <HomeEventCarousel events={topEvents} />
              </Flex>
            ) : (
              <EventList
                title="Top Events"
                events={topEvents}
                link="/events/top-events"
                loading={isTopEventsLoading}
              />
            )
          ) : null}
          {isNearbyEventsSuccess && (
            <EventList
              title="Events Near You"
              events={nearbyEvents}
              link="/events/nearby-events"
              loading={isNearbyEventsLoading}
            />
          )}
          {isUpcomingEventsSuccess && (
            <EventList
              title="Upcoming Events"
              events={upcomingEvents}
              link="/events/upcoming-events"
              loading={isUpcomingEventsLoading}
            />
          )}
        </Flex>
      </Container>
    </NVTLayout>
  );
}
