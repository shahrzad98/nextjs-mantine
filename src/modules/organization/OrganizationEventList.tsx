import { getMyEvents, organizationSearchEvents } from "@/api/handler/organization";
import { useBreakpoint, useInfiniteScroll } from "@/hooks";
import { StripeSetupModal } from "@/modules";
import userStore from "@/stores/userStore";
import { isHttpError } from "@/types";
import { errorNotification, getEventDateTimeInfo } from "@/utils";
import { myEventsKey } from "@/utils/queryKeys";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  rem,
  Select,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";

import { OrganizerEventCard, OrganizerEventCardSkeleton } from "@/components";

import CalendarIcon from "./assets/eventCalendar.svg";
import { eventStatusList } from "./constants";

export function OrganizationEventList({ collapsed }: { collapsed: boolean }) {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const router = useRouter();
  const theme = useMantineTheme();

  const { query } = router.query;

  const decodedQuery = query && decodeURIComponent(query as string);

  const { isMobile, isTablet } = useBreakpoint();

  const currentUser = userStore((state) => state.currentUser);
  const stripeIsActive = currentUser?.data?.organization?.active;

  const [opened, { open }] = useDisclosure(false);
  const [activeStatus, setActiveStatus] = useState<string>("all");
  useEffect(() => {
    if (!!currentUser && !stripeIsActive) {
      open();
    }
  }, [currentUser, open, stripeIsActive]);

  const handleCreateNewEvent = () => {
    if (stripeIsActive) {
      router.push("/organization/create-event/basic-info");
    }
  };

  const {
    data: eventsList,
    lastElementCallbackRef,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = useInfiniteScroll({
    queryKey: [myEventsKey, activeStatus, query as string],
    queryFn: ({ pageParam = 1 }) =>
      query
        ? organizationSearchEvents({ page: pageParam, perPage: 9, query: decodedQuery as string })
        : getMyEvents({
            page: pageParam,
            perPage: 9,
            status: activeStatus === "all" ? "" : activeStatus,
          }),
  });

  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }
  }, [error]);

  return (
    <Container size={!isMobile ? rem(1184) : "xs"}>
      <Flex justify={"space-between"} mb={rem(24)} mt={isTablet ? rem(30) : rem(20)}>
        {!isTablet && (
          <>
            <Title fw={500} size={rem(24)} color="rgba(255, 255, 255, 0.80)">
              My Events
            </Title>
            <Button
              gradient={{ from: "#3077F3", to: "#15AABF" }}
              fw={300}
              variant="gradient"
              leftIcon={<IconPlus size={rem(20)} />}
              size="md"
              onClick={handleCreateNewEvent}
            >
              Create New Event
            </Button>
          </>
        )}
      </Flex>

      {!query && (
        <Select
          label="Filter by status:"
          placeholder="Choose a filter"
          w={isMobile ? "100%" : 306}
          mb={isMobile ? rem(34) : rem(54)}
          value={activeStatus}
          onChange={(e) => setActiveStatus(e as string)}
          maxDropdownHeight={1000}
          data={eventStatusList}
        />
      )}
      {isMobile && eventsList?.pages?.length && (
        <Button
          leftIcon={<IconPlus />}
          size="md"
          variant={"gradient"}
          gradient={{ from: "#3077F3", to: "#15AABF" }}
          fw={300}
          mb={rem(34)}
          w={"100%"}
          onClick={handleCreateNewEvent}
        >
          Create new Event
        </Button>
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
                  event.start_at,
                  event.end_at,
                  event.time_zone?.utc_offset
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
                    <OrganizerEventCard
                      image={event.primary_image}
                      status={event.status}
                      date={`${weekday}, ${date}`}
                      time={`${startTime} - ${endTime} ${event.time_zone.abbr}`}
                      isBefore={isBefore}
                      title={event.name}
                      is_private={event.is_private}
                      address={`${event.address}, ${event.city}, ${event.province_state}, ${event.country}`}
                      onEdit={() => router.push(`/organization/event/${event.id}/edit`)}
                      onView={() => router.push(`/organization/event/${event.id}`)}
                    />
                  </Grid.Col>
                );
              })}
            </Grid>
          </Fragment>
        ))
      ) : (
        <Title order={3} color={theme.colors.blue[4]} my={50}>
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
      {eventsList?.pages?.length === 0 && (
        <Box mt={isMobile ? rem(36) : undefined} px={16}>
          <Flex direction={"column"} ml={!isMobile ? rem(30) : undefined}>
            <Image src={CalendarIcon} alt="calendar icon" />
            <Text size={rem(24)} my={rem(11)} color="#FFFFFF4D">
              No Events found!
            </Text>
            <Text maw={rem(700)} fw={300} sx={{ letterSpacing: "-0.5px" }}>
              Once you create events, you will see them displayed here. From this page you can edit
              them and manage your event tickets.
            </Text>
          </Flex>
          <Button
            rightIcon={!isMobile ? <IconChevronRight /> : undefined}
            leftIcon={isMobile ? <IconPlus /> : undefined}
            size="md"
            variant={isMobile ? "gradient" : "outline"}
            gradient={isMobile ? { from: "#3077F3", to: "#15AABF" } : undefined}
            fw={300}
            mt={rem(isMobile ? 57 : 44)}
            mb={"20vh"}
            w={isMobile ? "100%" : undefined}
            onClick={handleCreateNewEvent}
          >
            Create new Event
          </Button>
        </Box>
      )}
      <StripeSetupModal opened={opened} />
    </Container>
  );
}
