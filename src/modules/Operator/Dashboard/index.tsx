import { getMyEvents, organizationSearchEvents } from "@/api/handler/organization";
import { useBreakpoint, useInfiniteScroll } from "@/hooks";
import userStore from "@/stores/userStore";
import { UserType } from "@/types";
import { isHttpError } from "@/types/http";
import { IMyEvent } from "@/types/organization";
import { errorNotification, getEventDateTimeInfo } from "@/utils";
import { operatorEventsKey } from "@/utils/queryKeys";
import { Container, Grid, Text, rem, useMantineTheme, Title, TextInput, Flex } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

import { OperatorEventCard, OrganizerEventCardSkeleton } from "@/components";

dayjs.extend(utc);
dayjs.extend(timezone);

const operatorEventMapper = (events: IMyEvent[]) =>
  events.map((event) => {
    const { weekday, date, startTime, endTime } = getEventDateTimeInfo(
      event.start_at,
      event.end_at,
      event.time_zone?.utc_offset
    );

    return {
      id: event.id,
      ticketsLeft: event.available_tickets || 0,
      image: event.primary_image,
      date: `${weekday}, ${date}`,
      time: `${startTime} - ${endTime} ${event.time_zone.abbr}`,
      title: event.name,
      address: event.address,
      city: event.city,
      province_state: event.province_state,
      country: event.country,
    };
  });

const cardRedirectVariants: { [key in UserType]?: string } = {
  [UserType.Organizer]: "/organization/ticket-inspector",
  [UserType.Operator]: "/operator/event",
};

export const OperatorDashboardModule = () => {
  const router = useRouter();
  const { isMobile, isTablet } = useBreakpoint();
  const theme = useMantineTheme();

  const [keyword, setKeyword] = useState<string | null>(router.query.query as string);

  const currentUser = userStore((state) => state.currentUser);
  const isOrganizer = currentUser?.role === UserType.Organizer;

  const { query } = router.query;

  const decodedQuery = query && decodeURIComponent(query as string);

  const {
    data: eventsList,
    lastElementCallbackRef,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = useInfiniteScroll({
    queryKey: [operatorEventsKey, decodedQuery as string],
    queryFn: ({ pageParam = 1 }) =>
      decodedQuery
        ? organizationSearchEvents({ page: pageParam, perPage: 9, query: decodedQuery as string })
        : getMyEvents({
            page: pageParam,
            perPage: 9,
          }),
  });

  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }
  }, [error]);

  return (
    <>
      {!isTablet && (
        <Container maw={rem(1289)} my={rem(24)} px={isMobile ? rem(27) : undefined}>
          <Title order={1} size="h2" fw={500} color="#FFFFFFCC">
            Ticket Inspector
          </Title>
        </Container>
      )}
      <Container
        size={!isMobile ? rem(1184) : "xs"}
        mih={"75vh"}
        mb={rem(80)}
        mt={isMobile ? rem(80) : rem(54)}
      >
        {isOrganizer && (
          <Flex mb={"lg"}>
            <TextInput
              onChange={(e) => setKeyword(encodeURIComponent(e.target.value))}
              value={(keyword && decodeURIComponent(keyword)) || ""}
              defaultValue={decodedQuery}
              miw={rem(259)}
              placeholder="Search Events for inspection"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !!keyword?.length &&
                router.push(`/organization/ticket-inspector?query=${keyword}`)
              }
              rightSection={
                ((keyword && decodeURIComponent(keyword)?.length > 0) || decodedQuery) && (
                  <IconX
                    onClick={() => {
                      if (decodedQuery) {
                        router.push("/organization/ticket-inspector");
                      }
                      setKeyword(null);
                    }}
                    cursor="pointer"
                    pointerEvents="all"
                  />
                )
              }
            />
          </Flex>
        )}

        {decodedQuery && (
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
              <Grid gutter={rem(25)} mb={rem(32)}>
                {operatorEventMapper(page?.data)?.map((event) => (
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
                    <OperatorEventCard
                      onClick={() =>
                        router.push(
                          `${cardRedirectVariants[currentUser?.role as UserType]}/${event.id}/scan`
                        )
                      }
                      {...event}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Fragment>
          ))
        ) : (
          <Title order={3} color={theme.colors.blue[4]} my={50} fz={isMobile ? rem(20) : undefined}>
            There is nothing to display here !
          </Title>
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
    </>
  );
};
