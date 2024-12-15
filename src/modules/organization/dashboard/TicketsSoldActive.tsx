import { getSoldTickets } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { TicketsTablesSkeleton } from "@/modules";
import { EventStatistics } from "@/modules/organization/dashboard/EventStatistics";
import { isHttpError, TicketSold } from "@/types";
import { errorNotification, eventsKey, separateByThousands } from "@/utils";
import {
  Box,
  Card,
  Center,
  Collapse,
  createStyles,
  Divider,
  Flex,
  Pagination,
  rem,
  Stack,
  Table,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp, IconSquare } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TooltipItem } from "chart.js";
import dayjs from "dayjs";
import { isEmptyArray } from "is-what";
import React, { useEffect, useState } from "react";

import { GradientTitle, PieChart } from "@/components";

import { topFiveColors } from "./constant";

const useStyles = createStyles((theme) => ({
  tableRoot: {
    "tbody tr:nth-child(odd)": {
      backgroundColor: "#292A2F",
    },
    "tbody tr:hover": {
      background: "#282B3D",
    },
    "& tr": {
      "&:hover": {
        "td:first-child": {
          color: "#3077F3",
        },
      },
    },

    th: {
      fontSize: rem(13),
      [theme.fn.smallerThan("sm")]: {
        fontSize: rem(11),
      },
    },
  },
  cursorPointer: {
    cursor: "pointer",
    paddingRight: "20px",
  },
}));
export const TicketsSoldActive = () => {
  const [cardOpened, { toggle: toggleCard }] = useDisclosure(true);
  const { isMobile, isTablet } = useBreakpoint();
  const [showMore, { toggle: toggleShowMore }] = useDisclosure(false);

  const { classes } = useStyles();
  const theme = useMantineTheme();

  const [topFive, setTopFive] = useState<TicketSold[]>();

  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, error, isSuccess, isInitialLoading } = useQuery(
    [eventsKey("tickets-sold"), page],
    () => getSoldTickets(page, 10),
    {
      initialData: queryClient.getQueryData([eventsKey("tickets-sold")]),
      keepPreviousData: true,
    }
  );
  useEffect(() => {
    if (data && !topFive) {
      setTopFive(data.data.events.slice(0, 5));
    }
  }, [data, topFive]);
  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }
  }, [error]);

  const statistics = data?.data?.events?.map((event) => [
    event.name,
    dayjs(event.start_at).format("YYYY/MM/DD"),
    event.sold_tickets,
    event.sold_percentage,
  ]);
  const pieChartData = {
    datasets: topFive
      ? [
          {
            label: "Percent",
            data: topFive?.map((item) => Number(item?.sold_percentage?.toFixed(2))),
            backgroundColor: topFiveColors,
            borderWidth: 0,
            mode: "label",
            datalabels: {
              color: theme.colors.gray[0],
              formatter: function (value: number) {
                if (!value) return null;

                return value.toFixed(2) + " %";
              },
              font: {
                size: 20,
                weight: 700,
              },
            },
          },
        ]
      : [],
  };

  function isNotValidNumber(value: number) {
    return value === undefined || isNaN(value) || value === 0;
  }

  const isChartEmpty = pieChartData?.datasets?.[0]?.data?.every((i) => isNotValidNumber(i));
  const pieChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            return (context.raw as number).toFixed(2) + " %";
          },
        },
      },
    },
  };
  const card = (
    <Card py="md" px="xl" mx={isTablet ? 20 : undefined} mb={52}>
      {!isMobile && (
        <GradientTitle weight={500} size={rem(30)}>
          All Tickets Sold (Active Events)
        </GradientTitle>
      )}
      <Text size="sm" mb="xl" align={isMobile ? "center" : "start"}>
        Tickets Sold across all events
      </Text>
      <Flex justify={"center"} direction={isMobile ? "column-reverse" : "row"}>
        {!isMobile && (
          <Flex direction="column" justify="end" w={isMobile ? "100%" : "40%"}>
            {isChartEmpty ? (
              <Box m={120} w={150}>
                <Text color="gray.7">No data to display</Text>
              </Box>
            ) : (
              <Box w={256} h={256}>
                <PieChart data={pieChartData} options={pieChartOptions} />
              </Box>
            )}
          </Flex>
        )}
        <Flex
          direction="column"
          justify="center"
          miw={235}
          ml={isMobile ? 0 : 65}
          className={classes.tableRoot}
          w={isMobile ? "100%" : "50%"}
        >
          <Flex justify={isMobile ? "center" : "start"} align="center" mb="xl">
            <Title order={1}>{data?.data.total_tickets_sold}</Title>
            <Text size="xs" ml="xs">
              Total Tickets Sold
            </Text>
          </Flex>
          {isMobile && (
            <Center my={40}>
              <Stack>
                {isChartEmpty ? (
                  <Box my={30}>
                    <Text color="gray.7">No data to display</Text>
                  </Box>
                ) : (
                  <Box w={256} h={256}>
                    <PieChart data={pieChartData} options={pieChartOptions} />
                  </Box>
                )}
              </Stack>
            </Center>
          )}

          <Table
            fontSize="xs"
            w={isMobile ? "100%" : 390}
            sx={{
              "th:first-child": { width: "45%" },
              "th:nth-child(2)": { width: "30%" },
              td: {
                textWrap: "nowrap",
              },
            }}
          >
            <thead>
              <tr>
                <th>
                  <Text ml={27}>Event</Text>
                </th>
                <th>Tix Sold</th>
                <th>% Sold</th>
              </tr>
            </thead>
            <tbody>
              {topFive?.map((element, index) => (
                <tr key={index}>
                  <td>
                    <Flex align="center">
                      <Stack mr="sm">
                        <IconSquare size={15} strokeWidth={0} fill={topFiveColors[index]} />
                      </Stack>
                      {element.name.slice(0, 20)} {element.name.length > 20 && "..."}
                    </Flex>
                  </td>

                  <td>{separateByThousands(element.sold_tickets) || 0}</td>
                  <td>{(element.sold_percentage || 0).toFixed(2)} &nbsp;%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Flex>
      </Flex>

      {!isEmptyArray(statistics) && (
        <>
          <Divider
            labelPosition="left"
            my={40}
            label={
              <Flex
                align="center"
                onClick={() => toggleShowMore()}
                className={classes.cursorPointer}
              >
                <Text size="md" color="blue" mr="sm">
                  {showMore ? "Show less" : "Show more events"}
                </Text>
                {showMore ? (
                  <IconChevronUp size={20} color={theme.colors.blue[7]} />
                ) : (
                  <IconChevronDown size={20} color={theme.colors.blue[7]} />
                )}
              </Flex>
            }
          />

          <Collapse
            in={showMore}
            sx={{ overflow: isMobile ? "scroll" : "auto" }}
            px={isMobile ? 0 : 70}
          >
            {isSuccess && (
              <EventStatistics
                activePage={page}
                data={statistics ?? []}
                titles={["Event", "Date", "TIX Sold", "%Sold"]}
              />
            )}
          </Collapse>
          {isSuccess && data.meta.total_count > 0 && showMore && (
            <Pagination
              value={page}
              onChange={setPage}
              total={data.meta.total_count / 10 > 1 ? data.meta.total_count / 10 : 1}
              size="sm"
              position="center"
              my={50}
            />
          )}
        </>
      )}
    </Card>
  );

  return !isInitialLoading && !!data?.data.events ? (
    isMobile ? (
      <>
        <Flex justify="space-between" align="start" onClick={() => toggleCard()} my="xl">
          <Text size="md" m="xl" weight={500} w={250}>
            All Tickets Sold / Active and Upcoming Events
          </Text>
          {cardOpened ? (
            <Box mt="sm" mr="xl">
              <IconChevronUp color={theme.colors.gray[6]} size={22} stroke={2} />
            </Box>
          ) : (
            <Box mt="sm" mr="xl">
              <IconChevronDown color={theme.colors.gray[6]} size={22} stroke={2} />
            </Box>
          )}
        </Flex>
        <Collapse in={cardOpened}>{card}</Collapse>
      </>
    ) : (
      card
    )
  ) : (
    <TicketsTablesSkeleton />
  );
};
