import { getTopEventsSold } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { TopEventsSkeleton } from "@/modules";
import { isHttpError } from "@/types";
import { errorNotification, eventsKey, getEventDateTimeInfo } from "@/utils";
import { Carousel } from "@mantine/carousel";
import { Box, Card, createStyles, Flex, rem, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";

import { AppImage, GradientTitle } from "@/components";

const useStyles = createStyles((theme) => ({
  root: {
    ".mantine-Carousel-controls": {
      top: "80px",
    },
    ".mantine-Carousel-indicators": {
      top: "180px",
    },
    ".mantine-Carousel-indicator": {
      height: "5px",
      width: "35px",
      "&[data-active=true]": {
        backgroundColor: theme.colors.blue,
      },
    },
  },
}));
export const TopEventsSold: FC = () => {
  const router = useRouter();
  const { isMobile, isTablet } = useBreakpoint();
  const { classes } = useStyles();

  const queryClient = useQueryClient();
  const { data, error, isSuccess } = useQuery(
    [eventsKey("top-events-sold")],
    () => getTopEventsSold().then((response) => response.data),
    {
      initialData: queryClient.getQueryData([eventsKey("top-events-sold")]),
    }
  );
  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }
  }, [error]);

  return isSuccess && !!data.length ? (
    <Box>
      {isMobile && (
        <Text size="md" weight={500} m="md" color="gray.3">
          Top Events Sold
        </Text>
      )}
      {isSuccess && (
        <Card
          className={classes.root}
          w={324}
          miw={324}
          ml={isMobile ? 0 : isTablet ? 20 : "auto"}
          mb={isMobile ? "sm" : undefined}
        >
          <Card.Section>
            {!isMobile && (
              <GradientTitle weight={500} size={rem(30)} p={20}>
                Top Events Sold
              </GradientTitle>
            )}
            <Carousel
              withIndicators
              mb={isMobile ? 0 : "lg"}
              maw={324}
              previousControlIcon={<IconArrowLeft color="#fff" />}
              nextControlIcon={<IconArrowRight color="#fff" />}
              sx={{
                ".mantine-Carousel-control": {
                  width: "34px",
                  height: "34px",
                  backgroundColor: "#161616",
                  border: "none",
                  opacity: 1,
                  display: data?.length > 1 ? "flex" : "none",
                },
              }}
            >
              {data.map((item) => {
                const { weekday, date, startTime, endTime } = getEventDateTimeInfo(
                  item.start_at as string,
                  item.end_at as string,
                  item.time_zone.utc_offset
                );
                const fullAddress = `${item.address ? item.address + ", " : ""}${
                  item.city ? item.city + ", " : ""
                }${item.province_state ? item.province_state + ", " : ""}${item.country ?? ""}`;

                return (
                  <Carousel.Slide key={item.id}>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/organization/event/${item.id}`);
                      }}
                      sx={{
                        img: {
                          objectFit: item.primary_image ? "cover" : "unset",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <AppImage
                        style={{ objectFit: "cover" }}
                        src={item.primary_image ?? ""}
                        fill
                        alt={item.name}
                        wrapperHeight={196}
                      />
                      <Box px="md">
                        {isMobile && (
                          <Text size={10} weight={100} mt="lg" color="gray.5">
                            {item?.available_tickets} ticket
                            {item?.available_tickets > 1 ? "s" : null} left
                          </Text>
                        )}
                        <Title
                          size={24}
                          weight={500}
                          mt={!isMobile ? "lg" : undefined}
                          mb={5}
                          color="gray.0"
                          p={0}
                          lineClamp={1}
                        >
                          {item.name}
                        </Title>
                        <Flex w="max-content">
                          <Text size="sm" color="grape.4" sx={{ letterSpacing: "-0.2px" }}>
                            {weekday + ", " + date}
                          </Text>
                          <Text size="sm" color="grape.4" sx={{ letterSpacing: "-0.2px" }} ml="xs">
                            {startTime + " - " + endTime}
                          </Text>
                        </Flex>

                        <Text
                          size="sm"
                          sx={{ letterSpacing: "-0.2px" }}
                          mb="sm"
                          color={isMobile ? "gray.6" : "gray.4"}
                          weight={400}
                          lineClamp={1}
                        >
                          {fullAddress}
                        </Text>
                      </Box>
                    </Box>
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          </Card.Section>
        </Card>
      )}
    </Box>
  ) : (
    <TopEventsSkeleton />
  );
};
