import { useBreakpoint } from "@/hooks";
import { titleDictionary } from "@/modules/events/constant";
import { CustomAxiosResponse, IMyEvent } from "@/types";
import { ActionIcon, Container, Grid, Group, Title, rem } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { InfiniteData } from "@tanstack/query-core/src/types";
import { useRouter } from "next/router";
import React, { FC, Fragment, Ref } from "react";

import { HomeEventCard } from "@/components";
import HomeEventCardSkeleton from "@/components/HomeEventCard/Skeleton/Skeleton";

type EventModuleProps = {
  data: InfiniteData<CustomAxiosResponse<IMyEvent[]>> | undefined;
  lastElementCallbackRef: Ref<HTMLDivElement>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  isInitialLoading: boolean;
  slug: string;
};

export const EventsModule: FC<EventModuleProps> = ({
  data,
  hasNextPage,
  isFetchingNextPage,
  isInitialLoading,
  lastElementCallbackRef,
  slug,
}) => {
  const { isTablet } = useBreakpoint();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const hasInfiniteScroll = slug !== "top-events";

  return (
    <>
      {!isTablet && (
        <Container size={rem(1240)}>
          <Group pt={rem(24)}>
            <ActionIcon size="xl" variant="transparent" onClick={handleBack}>
              <IconArrowLeft size={rem(24)} color="rgba(255, 255, 255, 0.80)" />
            </ActionIcon>
            <Title order={3} size={rem(24)} c="rgba(255, 255, 255, 0.80)" fw={500}>
              {titleDictionary[slug as string]}
            </Title>
          </Group>
        </Container>
      )}
      <Container my={rem(60)}>
        {isInitialLoading && (
          <Grid my={0} gutter={isTablet ? 0 : 150}>
            {Array(hasInfiniteScroll ? 6 : 9)
              .fill(0)
              .map((i) => (
                <Grid.Col
                  sx={{ display: "flex", justifyContent: "center" }}
                  span={isTablet ? 12 : 4}
                  key={i}
                  p={0}
                  mb={isTablet ? 15 : hasInfiniteScroll ? 84 : 50}
                >
                  <HomeEventCardSkeleton key={i} />
                </Grid.Col>
              ))}
          </Grid>
        )}
        {data?.pages?.map((page, index) => (
          <Fragment key={index}>
            <Grid my={0} gutter={isTablet ? 0 : 150}>
              {page.data.map((event) => (
                <Grid.Col
                  sx={{ display: "flex", justifyContent: "center" }}
                  mb={isTablet ? 15 : hasInfiniteScroll ? 84 : 50}
                  span={isTablet ? 12 : 4}
                  ref={
                    hasInfiniteScroll && data?.pages.length * 6 < data?.pages[0]?.meta?.total_count
                      ? lastElementCallbackRef
                      : null
                  }
                  key={event.id}
                  p={0}
                >
                  <HomeEventCard
                    variant={isTablet ? "sm" : "lg"}
                    primary_image={(event.primary_image as string) || "/img/taylor.svg"}
                    name={event.name}
                    available_tickets={event.available_tickets}
                    start_at={event.start_at}
                    end_at={event.end_at as string}
                    address={event.address}
                    city={event.city}
                    country={event.country}
                    province_state={event.province_state}
                    organization={event.organization}
                    time_zone={event.time_zone}
                    onClick={() => router.push(`/event/${event.slug}`)}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Fragment>
        ))}

        <Grid my={0} gutter={isTablet ? 0 : 150}>
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
      {/*Todo: Decide if it is necessary to check hasNextPage & isFetchingNextPage both*/}
      {/*<Center m={20}>{hasNextPage && <Loader />}</Center>*/}
    </>
  );
};
