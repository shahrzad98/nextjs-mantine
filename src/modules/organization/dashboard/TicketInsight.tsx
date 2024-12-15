import { getTicketInsights } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { TicketInsightSkeleton } from "@/modules";
import { isHttpError } from "@/types";
import { errorNotification, getPercentage, separateByThousands } from "@/utils";
import {
  Box,
  Card,
  Center,
  Collapse,
  Flex,
  rem,
  Stack,
  Table,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { auto } from "@popperjs/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TooltipItem, ChartDataset } from "chart.js";
import React, { useEffect } from "react";

import { GradientTitle, PieChart } from "@/components";

export const TicketInsight = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const specificTablet = useMediaQuery("(min-width: 788px) and (max-width: 1000px)");
  const [cardOpened, { toggle: toggleCard }] = useDisclosure(true);
  const theme = useMantineTheme();

  const queryClient = useQueryClient();
  const { data, error, isSuccess } = useQuery(
    ["ticket-insight"],
    () => getTicketInsights().then((response) => response.data),
    {
      initialData: queryClient.getQueryData(["ticket-insight"]),
    }
  );

  const soldUnsoldInfo = isSuccess
    ? [
        {
          title: "Sold",
          tickets: data.sold_tickets_count,
          percent: getPercentage(
            data.sold_tickets_count,
            data.sold_tickets_count + data.unsold_tickets_count
          ),
        },
        {
          title: "Unsold",
          tickets: data.unsold_tickets_count,
          percent: getPercentage(
            data.unsold_tickets_count,
            data.sold_tickets_count + data.unsold_tickets_count
          ),
        },
      ]
    : [];

  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }
  }, [error]);

  function isNotValidNumber(value: number) {
    return value === undefined || isNaN(value) || value === 0;
  }

  const pieChartInfo = isSuccess
    ? [
        Number(
          getPercentage(
            data.unsold_tickets_count,
            data.sold_tickets_count + data.unsold_tickets_count
          ).toFixed(2)
        ),
        Number(
          getPercentage(
            data.sold_tickets_count,
            data.sold_tickets_count + data.unsold_tickets_count
          ).toFixed(2)
        ),
      ]
    : [];
  const isChartEmpty = pieChartInfo.every((i) => isNotValidNumber(i));

  const pieChartData = {
    datasets: [
      {
        label: "Percent",
        data: pieChartInfo,
        backgroundColor: ["#BE4BDB", "#5344F5"],
        borderWidth: 0,
        mode: "label",
        datalabels: {
          align: (context: { dataIndex: number; dataset: ChartDataset }) =>
            context.dataset.data.includes(0) ? "start" : "center",
          offset: 50,
          color: theme.colors.gray[0],
          formatter: function (value: number) {
            if (!value) return null;

            return value.toFixed(2) + " %";
          },
          font: {
            size: specificTablet ? 13 : 20,
            weight: 700,
          },
        },
      },
    ],
  };
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
    <Card
      w={!isMobile ? "100%" : auto}
      py={isMobile ? 30 : 18}
      pl={isMobile ? 47 : 35}
      pr={47}
      ml={isMobile ? 0 : 30}
      mx={isTablet ? 20 : undefined}
      mb={isMobile ? "lg" : undefined}
    >
      {!isMobile && (
        <GradientTitle weight={500} size={rem(30)}>
          All Tickets Sold / Unsold
        </GradientTitle>
      )}

      <Text
        size={13}
        mb={40}
        sx={{
          letterSpacing: "-0.2px",
        }}
      >
        Lifetime Total Tickets Sold vs Unsold
      </Text>
      <Flex justify="space-between" direction={isMobile ? "column-reverse" : "row"}>
        {!isMobile && (
          <Flex direction="column" justify="end">
            {isChartEmpty ? (
              <Box my={80} mx={isTablet ? "auto" : 80} w={150}>
                <Text color="gray.7">No data to display</Text>
              </Box>
            ) : (
              <PieChart
                data={pieChartData}
                options={pieChartOptions}
                width={isTablet ? 100 : 188}
                height={isTablet ? 100 : 188}
              />
            )}
          </Flex>
        )}
        <Flex direction="column" justify="end" miw={235}>
          <Box mb={25}>
            <Stack mb={40}>
              <Title size={rem(32)} sx={{ lineHeight: 0 }}>
                {separateByThousands(data?.sold_tickets_count)}
              </Title>
              <Text size="sm" color="dimmed">
                Sold
              </Text>
            </Stack>
            <Stack>
              <Title size={rem(32)} sx={{ lineHeight: 0 }}>
                {separateByThousands(data?.unsold_tickets_count)}
              </Title>
              <Text size="sm" color="dimmed">
                Unsold
              </Text>
            </Stack>
          </Box>
          {isMobile && (
            <Center mb={30}>
              <Stack>
                {isChartEmpty ? (
                  <Box m={50} w={150}>
                    <Text color="gray.7">No data to display</Text>
                  </Box>
                ) : (
                  <PieChart
                    data={pieChartData}
                    options={pieChartOptions}
                    width={170}
                    height={170}
                  />
                )}
              </Stack>
            </Center>
          )}
          <Box
            sx={{
              "& .mantine-Table-root": {
                th: {
                  fontSize: 10,
                  fontWeight: 600,
                },
                td: {
                  fontSize: 10,
                  fontWeight: 400,
                },
              },
            }}
          >
            <Table
              fontSize="xs"
              sx={{
                msTextCombineHorizontal: "inherit",
                "& tr:last-child td": {
                  borderBottom: "1px solid #373A3F",
                },
              }}
            >
              <thead>
                <tr>
                  <th />
                  <th>Tickets</th>
                  <th>Percent</th>
                </tr>
              </thead>
              <tbody>
                {soldUnsoldInfo.map((element, index) => (
                  <tr key={index}>
                    <td>
                      <Flex align="center">
                        <Box
                          w={10}
                          h={10}
                          mr={10}
                          bg={index === 0 ? "#5344F5" : "#BE4BDB"}
                          sx={{ borderRadius: "2px" }}
                        />
                        {element.title}
                      </Flex>
                    </td>

                    <td>{separateByThousands(element.tickets) || 0}</td>
                    <td>{element.percent.toFixed(2) || 0}&nbsp;%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );

  return isSuccess ? (
    isMobile ? (
      <Box w="100%">
        <Flex justify="space-between" align="center" onClick={() => toggleCard()}>
          <Text size="md" weight={500} ml={25}>
            All Tickets Sold / Unsold
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
      </Box>
    ) : (
      card
    )
  ) : (
    <Box w="100%">
      <TicketInsightSkeleton />
    </Box>
  );
};
