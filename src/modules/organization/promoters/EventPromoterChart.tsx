import { useBreakpoint } from "@/hooks";
import { Box, Card, Flex, rem } from "@mantine/core";
import { Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";
import { ChartData, ChartOptions } from "chart.js";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useMemo, useState } from "react";

import { GradientTitle, VerticalBar } from "@/components";

export interface IEventPromoterChartProps {
  title: string;
  description: string;
  total_count: number;
  total_name: string;
  chart_data?: {
    [date: string]: number;
  };
}

export const EventPromoterChart = ({
  title,
  description,
  total_count,
  total_name,
  chart_data,
}: IEventPromoterChartProps) => {
  dayjs.extend(weekOfYear);
  dayjs.extend(isoWeeksInYear);
  dayjs.extend(isLeapYear);

  const { isMobile } = useBreakpoint();

  const [currentDate, setCurrentDate] = useState({
    year: dayjs().year(),
    week: dayjs().week(),
  });

  const datasets = useMemo(() => {
    const startOfWeek = dayjs(`${currentDate.year}-1-1`)
      .week(currentDate.week)
      .startOf("week")
      .add(1, "day");

    const weekdays = new Array(7)
      .fill(startOfWeek)
      .map((day, idx) => day.add(idx, "day").format("MM/DD"));

    const data = new Array(7)
      .fill(startOfWeek)
      .map((day, idx) => day.add(idx, "day").format("YYYY-MM-DD"))
      .map((item) => chart_data?.[item] || 0);

    return {
      data: data || [],
      borderWidth: 1,
      barThickness: 45,
      barPercentage: 0.6,
      categoryPercentage: 1,
      weekdays: weekdays,
    };
  }, [chart_data, currentDate]);

  const barChartData: ChartData<"bar"> = {
    labels: datasets.weekdays,
    datasets: [datasets],
  };
  const maxChartValue = datasets.data.reduce(
    (a, b) => Math.max(a as number, b as number),
    -Infinity
  );

  const barChartOptions: ChartOptions<"bar"> = {
    backgroundColor: "#3077F3",
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        min: 0,
        suggestedMax: maxChartValue * 1.2,
        grid: {
          drawTicks: true,
        },
      },
    },
  };

  return (
    <Card
      mt={isMobile ? rem(34) : rem(20)}
      px={rem(30)}
      pt={rem(36)}
      pb={rem(50)}
      mb={rem(24)}
      withBorder
    >
      <Flex justify={"space-between"}>
        <Flex direction={"column"}>
          <GradientTitle fz={rem(30)}>{title}</GradientTitle>
          <Text fw={500} fz={rem(12)} c={"#FFFFFFB2"}>
            {description}
          </Text>
        </Flex>
        <Flex align={"center"} mr={rem(92)} gap={4}>
          <Text fw={500} size={rem(30)} c={"#E981FA"}>
            {total_count}
          </Text>
          <Text c={"#FFFFFF80"} size={rem(12)} fw={400}>
            {total_name}
          </Text>
        </Flex>
      </Flex>
      <Flex justify={"center"} mt={rem(71)}>
        <Text fw={600} mr={rem(20)}>
          {dayjs(`${currentDate.year}-1-1`).week(currentDate.week).format("YYYY MMMM")}, Week{" "}
          {currentDate.week}
        </Text>
        <Flex
          onClick={() => {
            if (currentDate.week === 1) {
              setCurrentDate((prev) => ({
                week: dayjs(`${prev.year - 1}-1-1`).isoWeeksInYear(),
                year: prev.year - 1,
              }));
            } else {
              setCurrentDate((prev) => ({ ...prev, week: prev.week - 1 }));
            }
          }}
          mr={rem(10)}
          sx={{ cursor: "pointer" }}
        >
          <IconChevronLeft />
        </Flex>
        <Flex
          onClick={() => {
            if (currentDate.week === dayjs(`${currentDate.year}-1-1`).isoWeeksInYear()) {
              setCurrentDate((prev) => ({
                week: 1,
                year: prev.year + 1,
              }));
            } else {
              setCurrentDate((prev) => ({ ...prev, week: prev.week + 1 }));
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          <IconChevronRight />
        </Flex>
      </Flex>
      <Box w="100%" maw={778} h={324} sx={{ margin: "auto" }} p={rem(20)} pt={0} pos="relative">
        <VerticalBar
          data={barChartData}
          options={barChartOptions}
          stepSize={Math.round((maxChartValue || 1) / 5) || 0.2}
        />
        <Box h={255} w={1} pos="absolute" bg="gray.8" top={30} right={20} />
      </Box>
    </Card>
  );
};
