import { useBreakpoint } from "@/hooks";
import { getPercentage, separateByThousands } from "@/utils";
import { Box, Card, Flex, Stack, Table, Text, useMantineTheme } from "@mantine/core";
import { IconSquare } from "@tabler/icons-react";
import { ChartDataset } from "chart.js/dist/types";
import React, { FC } from "react";

import { GradientTitle, PieChart } from "@/components";

interface ITicketSoldUnsoldProps {
  sold: number;
  unsold: number;
}

export const TicketsChartInfo: FC<ITicketSoldUnsoldProps> = ({ sold, unsold }) => {
  const { isMobile, isDesktop } = useBreakpoint();
  const theme = useMantineTheme();

  function isNotValidNumber(value: number) {
    return value === undefined || isNaN(value) || value === 0;
  }

  const isChartEmpty = [sold, unsold].every((i) => isNotValidNumber(i));
  const pieChartData = {
    datasets: [
      {
        label: "Percent",
        data: [sold, unsold],
        backgroundColor: [theme.colors.indigo[6], theme.colors.grape[4]],
        borderWidth: 0,
        mode: "label",
        datalabels: {
          align: (context: { dataIndex: number; dataset: ChartDataset }) =>
            context.dataset.data.includes(0) ? "start" : "center",
          offset: 50,
          color: theme.colors.gray[0],
          formatter: function (value: number) {
            if (!value) return null;

            return getPercentage(value, sold + unsold).toFixed(2) + " %";
          },
          font: {
            size: 20,
            weight: 700,
          },
        },
      },
    ],
  };
  const ticketsInfo = [
    { title: "Sold", tickets: sold, percent: getPercentage(sold, sold + unsold) },
    { title: "Unsold", tickets: unsold, percent: getPercentage(unsold, sold + unsold) },
  ];

  return (
    <Card py={34} px={isMobile ? 34 : 64} mb={isMobile ? "md" : "lg"}>
      <Flex direction={isMobile ? "column" : "row"} justify="space-between">
        <Box w={isDesktop ? 360 : undefined}>
          <GradientTitle order={3} weight={500} mb={isMobile ? 14 : 47} size={20}>
            All Tickets Sold / Unsold
          </GradientTitle>
          <Flex direction={isMobile ? "column" : "row"} justify="space-between" mb={45}>
            <Flex align="center">
              <Text size={34} component="span" weight={500}>
                {separateByThousands(sold) || 0}
              </Text>
              <Text component="span" size="xs" ml="xs" color="dimmed">
                Sold
              </Text>
            </Flex>
            <Flex align="center">
              <Text size={34} component="span" weight={500}>
                {separateByThousands(unsold) || 0}
              </Text>
              <Text component="span" size="xs" ml="xs" color="dimmed">
                Unsold
              </Text>
            </Flex>
          </Flex>
          <Table
            fontSize="xs"
            highlightOnHover
            mb={isMobile ? 40 : undefined}
            sx={{ "& tr:last-child td": { borderBottom: `1px solid  ${theme.colors.gray[8]}` } }}
          >
            <thead>
              <tr>
                <th />
                <th>Tickets</th>
                <th>Percent</th>
              </tr>
            </thead>
            <tbody>
              {ticketsInfo.map((element, index) => (
                <tr key={index}>
                  <td>
                    <Flex align="center">
                      <Stack mr="sm">
                        <IconSquare
                          size={15}
                          strokeWidth={0}
                          fill={index === 0 ? theme.colors.indigo[8] : theme.colors.grape[6]}
                        />
                      </Stack>
                      {element.title}
                    </Flex>
                  </td>

                  <td>{separateByThousands(element.tickets) || 0}</td>
                  <td>{element.percent ? element.percent.toFixed(2) : "0.00"}&nbsp;%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
        {isChartEmpty ? (
          <Box my={isMobile ? 50 : "auto"} m={isMobile ? "auto" : 100} w={150}>
            <Text color="gray.7">No data to display</Text>
          </Box>
        ) : (
          <Box
            mr={isMobile ? 0 : 70}
            w={isMobile ? 227 : 270}
            h={isMobile ? 227 : 270}
            sx={{ alignSelf: "center" }}
          >
            <PieChart
              data={pieChartData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        getPercentage(context.raw as number, sold + unsold).toFixed(2) + " %",
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Flex>
    </Card>
  );
};
