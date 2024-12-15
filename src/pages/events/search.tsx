import { searchEvents } from "@/api/handler";
import { useBreakpoint, useInfiniteScroll } from "@/hooks";
import { IHomeEvent, ISearchOrganization } from "@/types";
import { Box, Container, Flex, Grid, rem, Space, Text } from "@mantine/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/router";
import React, { Fragment, useMemo } from "react";

import { HomeEventCard, HomeSearch, NovelTHead, NVTLayout } from "@/components";
import HomeEventCardSkeleton from "@/components/HomeEventCard/Skeleton/Skeleton";
import OrganizationSearchResult from "@/components/HomeSearch/OrganizationSearchResult";

const HomeEventsSearch = () => {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { isTablet, isDesktop } = useBreakpoint();
  const {
    query: { query, start_date, end_date, lat, lng, location },
    isReady,
  } = useRouter();
  const { data, hasNextPage, isFetchingNextPage, isInitialLoading, lastElementCallbackRef } =
    useInfiniteScroll({
      queryKey: [
        "search",
        query as string,
        start_date as string,
        end_date as string,
        lat as string,
        lng as string,
      ],
      queryFn: ({ pageParam = 1 }) =>
        searchEvents({
          query: query as string,
          start_date: start_date as string,
          end_date: end_date as string,
          lat: parseFloat(lat as string),
          lng: parseFloat(lng as string),
          page: pageParam,
          per_page: 6,
        }),
    });
  dayjs.extend(utc);
  const start_at = dayjs.utc(start_date as string).format("MMMM D, YYYY");
  const end_at = dayjs.utc(end_date as string).format("MMMM D, YYYY");
  const noEvent = data?.pages[0].meta.total_events;
  const noResult =
    data?.pages[0].meta.total_events === 0 && data?.pages[0].meta.total_organizations === 0;
  const noResultText = useMemo(() => {
    const date = start_date || end_date;

    if (query && !location && !date) {
      return `No Events Found for  '${decodeURIComponent(query as string)}'`;
    }
    if (!query && location && !date) {
      return "No Events near your location";
    }

    if (!query && !location && date) {
      return "No Events Found for the selected date";
    }

    return "No Events Found";
  }, [end_date, location, query, start_date]);

  return (
    <>
      <NVTLayout
        navbarProps={{ background: "none" }}
        backgroundGradientVariant={
          (query && noResult) || start_at || (end_date && noEvent) || (location && noEvent)
            ? 14
            : 10
        }
      >
        <NovelTHead title="Search" />
        <Container
          mt={isMobile ? 0 : 65}
          mb={65}
          size={isTablet ? "md" : "xl"}
          sx={{ width: isDesktop ? 1042 : "100%" }}
          px={isDesktop ? rem(1) : rem(20)}
        >
          <Flex mih={isMobile ? rem(190) : rem(200)} justify="flex-end" direction="column">
            {isReady && <HomeSearch />}
          </Flex>
          {isInitialLoading && (
            <Grid my={0} gutter={isTablet ? 0 : 150}>
              {Array(6)
                .fill(0)
                .map((i) => (
                  <Grid.Col
                    sx={{ display: "flex", justifyContent: "center" }}
                    span={isTablet ? 12 : 4}
                    key={i}
                    p={0}
                    mb={isTablet ? 15 : 84}
                    mt={rem(83)}
                  >
                    <HomeEventCardSkeleton key={i} />
                  </Grid.Col>
                ))}
            </Grid>
          )}
          <Box>
            {!isTablet &&
              query &&
              (data?.pages[0]?.meta.total_organizations !== 0 ||
                data?.pages[0]?.meta.total_events !== 0) && (
                <Text mt={rem(42)} color="gray.5" size={rem(20)}>
                  Search Result for:{" "}
                  <Text span color="gray.0">
                    {decodeURIComponent(query as string)}
                  </Text>
                </Text>
              )}
          </Box>

          {data?.pages[0]?.meta.total_organizations !== 0 && query && (
            <Text size={isMobile ? rem(14) : rem(20)} mt={isTablet ? 30 : 58}>
              Artists, Teams and Organizations
            </Text>
          )}

          {data?.pages?.map((page, index) => (
            <Grid my={0} key={index} gutter={isTablet ? 0 : 40}>
              {(page.meta.total_organizations as number) > 0 &&
                query &&
                page.data.organizations.map((organization: ISearchOrganization) => {
                  return (
                    <Grid.Col
                      sx={{ display: "flex", justifyContent: "center" }}
                      mt={isTablet ? rem(15) : rem(20)}
                      mr={isTablet ? 16 : undefined}
                      xs={12}
                      sm={5}
                      md={4}
                      p={0}
                      ref={index !== page.data.events.length - 1 ? lastElementCallbackRef : null}
                      key={organization.id}
                    >
                      <OrganizationSearchResult organization={organization} />
                    </Grid.Col>
                  );
                })}
            </Grid>
          ))}

          {data?.pages[0]?.meta.total_events !== 0 && query && (
            <Text
              size={isMobile ? rem(14) : rem(20)}
              mt={isTablet ? rem(23) : rem(62)}
              color="#FFFFFFCC"
            >
              Events
            </Text>
          )}
          {data?.pages?.map((page, index) => (
            <Fragment key={index}>
              <Box ml={isTablet ? 10 : 0}>
                <Grid mt={(query as string)?.length > 0 ? 0 : 30} gutter={40}>
                  {page.meta.total_events === 0 && index === 0 && (
                    <Grid.Col span={12} p={0} mt={isMobile ? 30 : rem(55)}>
                      <Text
                        color="#E981FA"
                        size={isMobile ? rem(16) : rem(20)}
                        fw={500}
                        lh={rem(30)}
                        px={isMobile ? rem(14) : 0}
                      >
                        {noResultText}
                      </Text>
                      <Text
                        size={rem(16)}
                        fw={"400"}
                        lh={rem(22)}
                        mt={rem(20)}
                        px={isMobile ? rem(14) : 0}
                      >
                        We didn’t find anything that matched your search, please try something else.
                      </Text>
                    </Grid.Col>
                  )}

                  {(page.meta.total_events as number) > 0 &&
                    start_date &&
                    end_date &&
                    index === 0 && (
                      <>
                        <Grid.Col
                          px={isTablet ? 12 : 18}
                          py={0}
                          mt={isMobile ? rem(37) : rem(55)}
                          mb={isMobile ? 27 : 53}
                        >
                          <Text
                            sx={{ letterSpacing: "-0.5px" }}
                            size={isMobile ? rem(16) : rem(20)}
                            fw={400}
                            lh={rem(22)}
                            color="rgba(255, 255, 255, 0.70)"
                          >
                            Search Date Range: &nbsp;
                            {isTablet && <Space h={3} />}
                            <Text span={isDesktop} color="#fff">
                              {start_at} - {end_at}
                            </Text>
                          </Text>
                        </Grid.Col>
                      </>
                    )}

                  {(page.meta.total_events as number) > 0 &&
                    page.data.events.map((event: IHomeEvent) => {
                      return (
                        <Grid.Col
                          sx={{ display: "flex", justifyContent: "center" }}
                          mt={isTablet ? rem(16) : rem(30)}
                          mr={isTablet ? 16 : undefined}
                          xs={12}
                          sm={5}
                          md={4}
                          p={0}
                          mb={isMobile ? 0 : 20}
                          ref={
                            index !== page.data.events.length - 1 ? lastElementCallbackRef : null
                          }
                          key={event.id}
                        >
                          <HomeEventCard
                            address={event.address}
                            city={event.city}
                            country={event.country}
                            province_state={event.province_state}
                            organization={event.organization}
                            end_at={event.end_at}
                            start_at={event.start_at}
                            available_tickets={event.available_tickets}
                            primary_image={event.primary_image}
                            name={event.name}
                            time_zone={event.time_zone}
                            variant={isTablet ? "sm" : "lg"}
                            onClick={() => router.push(`/event/${event.slug}`)}
                          />
                        </Grid.Col>
                      );
                    })}
                </Grid>
              </Box>
            </Fragment>
          ))}
          <Grid mb={isTablet ? 123 : 239} gutter={isTablet ? 0 : 150}>
            {isFetchingNextPage &&
              hasNextPage &&
              Array(3)
                .fill(0)
                .map((i) => (
                  <Grid.Col
                    sx={{ display: "flex", justifyContent: "center" }}
                    span={isTablet ? 12 : 4}
                    key={i}
                    p={0}
                  >
                    <HomeEventCardSkeleton key={i} />
                  </Grid.Col>
                ))}
          </Grid>
        </Container>
      </NVTLayout>
    </>
  );
};

export default HomeEventsSearch;
