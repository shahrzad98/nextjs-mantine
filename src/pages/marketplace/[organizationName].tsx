import { getOrganization, getOrganizationEvents } from "@/api/handler/organization";
import { useBreakpoint } from "@/hooks";
import { ExpandableText } from "@/modules";
import { CustomAxiosResponse, isHttpError, IMyEvent } from "@/types";
import { IOrganization } from "@/types";
import { errorNotification } from "@/utils";
import { eventsKey, organizationKey } from "@/utils/queryKeys";
import {
  Box,
  Container,
  Flex,
  Grid,
  Loader,
  rem,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { IconMapPin } from "@tabler/icons-react";
import { InfiniteData, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef } from "react";
import sanitizeHtml from "sanitize-html";

import { AppImage, HomeEventCard, NovelTHead, NVTLayout } from "@/components";

const EVENTS_PER_PAGE = 6;

export default function OrganizationShow() {
  const router = useRouter();
  const { organizationName } = router.query;

  const queryClient = useQueryClient();

  const { isMobile, isTablet } = useBreakpoint();

  const {
    data: organization,
    error,
    isSuccess: isOrganizationSuccess,
  } = useQuery(
    [organizationKey(organizationName as string)],
    () => getOrganization(organizationName as string).then((res) => res.data),
    {
      initialData: queryClient.getQueryData([organizationKey(organizationName as string)]),
      enabled: !!organizationName,
    }
  );

  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }
  }, [error]);

  const initialEventsData = queryClient.getQueryData([
    organizationKey(organizationName as string),
    eventsKey,
  ]);

  const {
    data: events,
    error: eventsError,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(
    [organizationKey(organizationName as string), eventsKey],
    ({ pageParam = 1 }) =>
      getOrganizationEvents(organizationName as string, EVENTS_PER_PAGE, pageParam),
    {
      initialData: initialEventsData as InfiniteData<CustomAxiosResponse<IMyEvent[]>>,
      enabled: !!organizationName && !initialEventsData,
      retry: false,
      getNextPageParam: (lastPage, allPages) => {
        if (allPages.length * EVENTS_PER_PAGE >= lastPage.meta.total_count) {
          return undefined;
        }

        return allPages.length + 1;
      },
    }
  );

  useEffect(() => {
    if (isHttpError(eventsError)) {
      errorNotification(eventsError);
    }
  }, [eventsError]);

  const containerRef = useRef();
  const { ref: lastElementRef, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage]);

  return (
    <NVTLayout backgroundGradientVariant={7}>
      <NovelTHead title={organization?.name as string} />
      <Box pos="relative" sx={{ img: { objectFit: "cover" } }}>
        {isOrganizationSuccess && (
          <AppImage
            src={organization.cover_photo ?? ""}
            alt={organization.name}
            wrapperHeight={isMobile ? 120 : 480}
            fill
          />
        )}
      </Box>
      <Container maw={rem(1075)} mb={isMobile ? rem(40) : 0} px={rem(!isMobile ? 16 : 31)}>
        {isOrganizationSuccess ? (
          <Flex
            direction="column"
            h={rem(isMobile ? 44 : 103)}
            justify="center"
            mt={isMobile ? rem(10) : rem(58)}
          >
            <Title
              order={1}
              size={isMobile ? rem(18) : rem(36)}
              lineClamp={!isMobile ? 2 : 1}
              h={rem(!isMobile ? 73 : 28)}
              lh={rem(!isMobile ? 30 : 28)}
            >
              {organization.name}
            </Title>
          </Flex>
        ) : (
          <Skeleton h={isMobile ? rem(31) : rem(44)} mt={isMobile ? rem(10) : rem(58)} />
        )}
        {isOrganizationSuccess ? (
          <>
            {organization?.city && (
              <Flex
                mt={!isMobile ? rem(10) : rem(8)}
                mb={!isMobile ? rem(28) : rem(15)}
                gap={rem(10)}
              >
                <IconMapPin size={rem(!isMobile ? 28 : 12)} color="#E981FA" />
                <Stack spacing={isMobile ? 0 : rem(7)}>
                  <Text size={rem(!isMobile ? 20 : 12)}>
                    {organization?.city}, {organization?.country}
                  </Text>
                  <Text size={rem(!isMobile ? 16 : 10)}>{organization?.address}</Text>
                </Stack>
              </Flex>
            )}
          </>
        ) : (
          <Skeleton h={rem(60)} my={isMobile ? rem(24) : rem(64)} />
        )}

        {isOrganizationSuccess ? (
          organization?.description && (
            <ExpandableText maxHeight={isMobile ? 88 : 72}>
              <Text size={rem(isMobile ? 16 : 24)} lh={rem(isMobile ? 22 : 36)}>
                {sanitizeHtml(organization.description)}
              </Text>
            </ExpandableText>
          )
        ) : (
          <Skeleton h={rem(isMobile ? 88 : 72)} />
        )}
      </Container>

      <Container
        maw={rem(1075)}
        mt={isMobile ? rem(24) : rem(60)}
        mb={rem(isMobile ? 50 : 75)}
        px={rem(!isMobile ? 16 : 15)}
      >
        <Grid gutter="md" gutterLg={rem(50)}>
          {isOrganizationSuccess &&
            events &&
            events.pages.map((page, index) => (
              <Fragment key={index}>
                {page.data.map((event, eventIndex) => (
                  <Grid.Col
                    sx={{ display: "flex", justifyContent: "center" }}
                    mt={isTablet ? rem(8) : rem(16)}
                    xs={12}
                    md={4}
                    p={0}
                    ref={eventIndex !== page.data.length - 1 ? lastElementRef : null}
                    key={event.id}
                  >
                    <HomeEventCard
                      variant={isMobile ? "sm" : "lg"}
                      primary_image={event.primary_image}
                      name={event.name}
                      available_tickets={event.available_tickets}
                      start_at={event.start_at}
                      end_at={event.end_at}
                      time_zone={event.time_zone}
                      address={event.address}
                      city={event.city}
                      country={event.country}
                      province_state={event.province_state}
                      organization={organization as Partial<IOrganization>}
                      onClick={() => router.push(`/event/${event.slug}`)}
                    />
                  </Grid.Col>
                ))}
              </Fragment>
            ))}
          {isFetching &&
            Array(EVENTS_PER_PAGE)
              .fill(null)
              .map((i, k) => (
                <Grid.Col
                  sx={{ display: "flex", justifyContent: "center" }}
                  mt={isTablet ? rem(8) : rem(16)}
                  mr={isTablet ? 16 : undefined}
                  xs={12}
                  md={4}
                  p={0}
                  key={k}
                >
                  <Skeleton
                    width={isMobile ? rem(330) : rem(324)}
                    height={isMobile ? rem(138) : rem(480)}
                  />
                </Grid.Col>
              ))}
        </Grid>
        {isFetching && <Loader size="xl" w="100%" m={`0 auto ${rem(75)}`} />}
      </Container>
    </NVTLayout>
  );
}
