import { useBreakpoint } from "@/hooks";
import EventListSkeleton from "@/modules/Home/Skeleton";
import { IMyEvent } from "@/types";
import { Anchor, Box, Button, Flex, Grid, rem, Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";

import { HomeEventCard } from "@/components";
import HomeEventCardSkeleton from "@/components/HomeEventCard/Skeleton/Skeleton";

import GradientChevronRight from "./assets/gradient-chevron-right.svg";
interface IEventListProps {
  title: string;
  events: IMyEvent[];
  link: string;
  loading?: boolean;
}

export const EventList = ({ title, events, link, loading }: IEventListProps) => {
  const router = useRouter();

  const { isMobile, isTablet } = useBreakpoint();

  return (
    <Flex w="100%" direction="column" mb={isMobile ? rem(40) : rem(75)}>
      <Flex
        justify="space-between"
        align="center"
        mb={isMobile ? rem(10) : rem(30)}
        mx={isMobile ? "1rem" : undefined}
      >
        <Text
          size={isMobile ? rem(16) : rem(32)}
          lts="-0.04em"
          lh={isMobile ? rem(30) : rem(39)}
          weight={isMobile ? 500 : 400}
          color="gray.4"
        >
          {title}
        </Text>
        {!isMobile && events?.length > 0 && (
          <Anchor display="flex" href={link} underline={false}>
            <Text
              size={rem(15)}
              weight="600"
              sx={{
                background: "var(--Gradient, linear-gradient(45deg, #3077F3 0%, #15AABF 100%))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              View All
            </Text>
            <Image src={GradientChevronRight} alt="chevron right" style={{ marginLeft: 10 }} />
          </Anchor>
        )}
      </Flex>
      <Flex
        justify={events.length > 2 ? "space-between" : "flex-start"}
        align="center"
        direction={isMobile ? "column" : "row"}
      >
        {!loading && events?.length ? (
          events.map((event, i) => (
            <Box
              key={i}
              mb={isMobile ? "0.75rem" : undefined}
              mr={isMobile ? 0 : isTablet ? 16 : 35}
            >
              <HomeEventCard
                variant={isMobile ? "sm" : "lg"}
                {...event}
                onClick={() => router.push(`/event/${event.slug}`)}
              />
            </Box>
          ))
        ) : (
          <EventListSkeleton />
        )}

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
      </Flex>

      {isMobile && events?.length > 0 && (
        <Button
          h={rem(44)}
          w={rem(271)}
          mx="auto"
          mt="0.5rem"
          variant="outline"
          radius="0.25rem"
          onClick={() => router.push(link)}
          sx={{
            borderImageSource: "linear-gradient(to bottom, #3077F3 , #15AABF )",
            borderImageSlice: "1",
            borderWidth: "1px",
            border: "1px solid",
          }}
        >
          <Text
            size={rem(15)}
            weight="600"
            sx={{
              background: "var(--Gradient, linear-gradient(45deg, #3077F3 0%, #15AABF 100%))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            View All
          </Text>
          <Image src={GradientChevronRight} alt="chevron right" style={{ marginLeft: 10 }} />
        </Button>
      )}
    </Flex>
  );
};
