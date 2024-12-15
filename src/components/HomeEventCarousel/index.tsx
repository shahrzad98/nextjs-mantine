import { useBreakpoint } from "@/hooks";
import { IMyEvent } from "@/types";
import { Carousel } from "@mantine/carousel";
import { Grid, Skeleton, useMantineTheme } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/router";

import { HomeEventCard } from "@/components";

import HomeEventCardSkeleton from "../HomeEventCard/Skeleton/Skeleton";

export interface IHomeEventCarouselProps {
  events: IMyEvent[];
  loading?: boolean;
}

export const HomeEventCarousel = ({ events, loading }: IHomeEventCarouselProps) => {
  const { isMobile, isTablet } = useBreakpoint();
  const router = useRouter();
  const theme = useMantineTheme();

  return events?.length ? (
    <Carousel
      withIndicators
      maw={320}
      loop
      mx="auto"
      sx={{ backgroundColor: "#161616E5" }}
      styles={{
        indicator: {
          width: 42,
          height: 5,
          marginBottom: 285,
          transition: "width 250ms ease",
          opacity: 1,
          "&[data-active]": {
            backgroundColor: "#3077F3",
          },
        },
        controls: {
          marginTop: -144,
          opacity: 1,
        },
        control: {
          backgroundColor: theme.fn.rgba(theme.colors.dark[8], 0.9),

          border: "none",
          width: 34,
          height: 34,
          opacity: 1,
        },
      }}
      nextControlIcon={<IconArrowRight color={theme.colors.gray[0]} size={20} />}
      previousControlIcon={<IconArrowLeft color={theme.colors.gray[0]} size={20} />}
    >
      {!loading &&
        events.map((card, i) => (
          <Carousel.Slide key={i}>
            <HomeEventCard {...card} onClick={() => router.push(`/event/${card.slug}`)} />
          </Carousel.Slide>
        ))}
      {loading && (
        <Grid m={0} gutter={isTablet ? 0 : 150} w={"100%"}>
          {Array(3)
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
      )}
    </Carousel>
  ) : (
    <Skeleton mb={isMobile ? 0 : "xl"} width="100%" height={isMobile ? 100 : 196} animate={false} />
  );
};
