import { getPromoterEvents, getPromoterOrganizations } from "@/api/handler/promoter";
import { useBreakpoint, useInfiniteScroll } from "@/hooks";
import userStore from "@/stores/userStore";
import { isHttpError } from "@/types";
import { errorNotification } from "@/utils";
import { getEventDateTimeInfo } from "@/utils/getEventDateTimeInfo";
import { myEventsKey, promoterOrganizationsKey } from "@/utils/queryKeys";
import { Box, Container, Flex, Grid, rem, Select, Text, Title } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";

import { OrganizerEventCardSkeleton } from "@/components";
import { PromoterEventCard } from "@/components/OrganizationEventCard/PromoterEventCard";

import CalendarIcon from "./assets/eventCalendar.svg";

export function PromoterEventList({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();

  const { query } = router.query;

  const queryClient = useQueryClient();

  const decodedQuery = query && decodeURIComponent(query as string);

  const { isMobile, isTablet } = useBreakpoint();

  const [activeOrganization, setActiveOrganization] = useState<string | null>(null);

  const currentUser = userStore((state) => state.currentUser);

  const {
    data: eventsList,
    lastElementCallbackRef,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = useInfiniteScroll({
    queryKey: [myEventsKey, activeOrganization as string, query as string],
    queryFn: ({ pageParam = 1 }) =>
      query
        ? getPromoterEvents({ page: pageParam, perPage: 9, query: decodedQuery as string })
        : getPromoterEvents({
            page: pageParam,
            perPage: 9,
            organizationId: activeOrganization || undefined,
          }),
  });

  const {
    data: organizations,
    isSuccess: isOrganizationsSuccess,
    error: isOrganizationsError,
  } = useQuery(
    [promoterOrganizationsKey],
    () => getPromoterOrganizations().then((res) => res.data),
    {
      initialData: queryClient.getQueryData([promoterOrganizationsKey]),
    }
  );

  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }

    if (isHttpError(isOrganizationsError)) {
      errorNotification(isOrganizationsError);
    }
  }, [error, isOrganizationsError]);

  return (
    <Container size={!isMobile ? rem(1184) : "xs"}>
      <Flex justify={"space-between"} mb={rem(24)} mt={isTablet ? rem(30) : rem(20)}>
        {!isTablet && (
          <>
            <Title fw={500} size={rem(24)} color="rgba(255, 255, 255, 0.80)">
              Events
            </Title>
          </>
        )}
      </Flex>

      {!query && (
        <Select
          label="Filter by Organization:"
          placeholder="None"
          w={isMobile ? "100%" : 306}
          mb={isMobile ? rem(34) : rem(54)}
          value={activeOrganization}
          onChange={(e) => {
            queryClient.refetchQueries([
              myEventsKey,
              activeOrganization as string,
              query as string,
            ]);
            setActiveOrganization(e as string);
          }}
          maxDropdownHeight={1000}
          data={
            isOrganizationsSuccess
              ? organizations?.map((item) => ({ value: item.id, label: item.name }))
              : []
          }
        />
      )}

      {query && (
        <Text mb={rem(36)}>
          Keyword:{" "}
          <Text span fw={900} size={"1.2rem"}>
            {decodedQuery}
          </Text>
        </Text>
      )}

      {isInitialLoading && (
        <Grid my={0} gutter={isTablet ? 0 : 50}>
          {Array(9)
            .fill(0)
            .map((i) => (
              <Grid.Col
                sx={{ display: "flex", justifyContent: "center" }}
                span={isTablet ? 12 : 4}
                key={i}
                p={0}
                mb={isTablet ? 15 : 84}
              >
                <OrganizerEventCardSkeleton key={i} />
              </Grid.Col>
            ))}
        </Grid>
      )}

      {eventsList && eventsList.pages[0].meta.total_count > 0 ? (
        eventsList?.pages?.map((page, index) => (
          <Fragment key={index}>
            <Grid
              gutter={collapsed ? rem(34) : rem(36)}
              mb={rem(32)}
              px={isTablet ? "auto" : collapsed ? 57 : 0}
            >
              {page?.data?.map((event) => {
                const { date, weekday, startTime, endTime, isBefore } = getEventDateTimeInfo(
                  event.event.start_at,
                  event.event.end_at
                );

                return (
                  <Grid.Col
                    md={4}
                    xs={12}
                    key={event.id}
                    ref={
                      eventsList?.pages.length * 9 < eventsList?.pages[0]?.meta?.total_count
                        ? lastElementCallbackRef
                        : null
                    }
                  >
                    <PromoterEventCard
                      image={event.event.primary_image}
                      status={event.event.status}
                      date={`${weekday}, ${date}`}
                      time={`${startTime} - ${endTime}`}
                      isBefore={isBefore}
                      slug={event.event.slug}
                      title={event.event?.name}
                      address={`${event.event.address}, ${event.event.city}, ${event.event.province_state}, ${event.event.country}`}
                      onView={() => router.push(`/promoter/event/${event.id}`)}
                      promoterName={currentUser?.data?.username as string}
                    />
                  </Grid.Col>
                );
              })}
            </Grid>
          </Fragment>
        ))
      ) : (
        <Box mt={isMobile ? rem(36) : undefined} px={16}>
          <Flex direction={"column"} ml={!isMobile ? rem(30) : undefined}>
            <Image src={CalendarIcon} alt="calendar icon" />
            <Text size={rem(24)} my={rem(11)} color="#FFFFFF4D">
              Ready to Rock? No Events Yet!
            </Text>
            <Text maw={rem(700)} fw={300} sx={{ letterSpacing: "-0.5px" }}>
              Your stage is waiting! Once you accept offers for events, they will be showcased here.
              Get started and let the opportunities roll in.
            </Text>
          </Flex>
        </Box>
      )}

      {isFetchingNextPage && hasNextPage && (
        <Grid gutter={isTablet ? 0 : 50} my={0} px={20}>
          {Array(3)
            .fill(0)
            .map((i) => (
              <Grid.Col
                sx={{ display: "flex", justifyContent: "center" }}
                span={isTablet ? 12 : 4}
                key={i}
                mb={40}
                p={0}
              >
                <OrganizerEventCardSkeleton key={i} />
              </Grid.Col>
            ))}
        </Grid>
      )}
    </Container>
  );
}
