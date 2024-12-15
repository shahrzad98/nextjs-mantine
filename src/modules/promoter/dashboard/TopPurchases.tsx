import { getPromoterEvents, getPurchasesPerYear } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { EventStatistics, TicketsTablesSkeleton } from "@/modules";
import { isHttpError } from "@/types";
import { errorNotification, eventsKey, promoterTop5EventsKey, separateByThousands } from "@/utils";
import {
  Box,
  Card,
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
import { ChartData, Chart, ChartOptions } from "chart.js";
import { TooltipModel } from "chart.js/dist/types";
import dayjs from "dayjs";
import { isEmptyArray } from "is-what";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

import { GradientTitle, HorizontalBar, VerticalBar } from "@/components";
import { monthDictionary } from "@/components/Chart/constant";

import ArrowLeft from "../assets/arrow-left.svg";
import ArrowRight from "../assets/arrow-right.svg";
import { months, topFiveColors, monthIndex } from "./constant";

const useStyles = createStyles((theme) => ({
  tableRoot: {
    padding: "0 90px",
    [theme.fn.smallerThan("md")]: {
      padding: 0,
    },
    ".mantine-Table-root": {
      "tbody tr:nth-child(odd)": {
        backgroundColor: "#292A2F",
      },
      "tbody tr:hover": {
        background: "#282B3D",
      },
      "& tr:hover": {
        "td:first-child": {
          color: "#3077F3",
        },
      },

      th: {
        fontSize: rem(13),
        [theme.fn.smallerThan("sm")]: {
          fontSize: rem(11),
        },
      },
    },
  },
  cursorPointer: {
    cursor: "pointer",
    paddingRight: "20px",
  },
}));

export const TopPurchases = () => {
  const { classes } = useStyles();
  const [showMore, { toggle: toggleShowMore }] = useDisclosure(false);
  const [cardOpened, { toggle: toggleCard }] = useDisclosure(true);
  const [page, setPage] = useState(1);

  const currentYear = parseInt(dayjs(Date.now()).format("YYYY"));
  const [year, setYear] = useState(currentYear);
  const [firstHalfYear, setFirstHalfYear] = useState(true);
  const { isMobile, isTablet } = useBreakpoint();
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  const {
    data: top5Events,
    error: top5EventsError,
    isSuccess: top5EventsSuccess,
    isInitialLoading: top5EventsIsInitialLoading,
  } = useQuery(
    [promoterTop5EventsKey, year],
    () => getPurchasesPerYear(year).then((response) => response.data),
    {
      initialData: queryClient.getQueryData([promoterTop5EventsKey]),
    }
  );

  const {
    data: events,
    error: eventsError,
    isSuccess: eventsSuccess,
    isInitialLoading: eventsIsInitialLoading,
  } = useQuery([eventsKey("sales-month"), page], () => getPromoterEvents({ page, perPage: 5 }), {
    initialData: queryClient.getQueryData([eventsKey("sales-month")]),
  });

  useEffect(() => {
    if (isHttpError(top5EventsError)) {
      errorNotification(top5EventsError);
    }
    if (isHttpError(eventsError)) {
      errorNotification(eventsError);
    }
  }, [top5EventsError, eventsError]);

  const statistics = events?.data?.map((event) => [
    event.event.name,
    event.revenue,
    String(event.purchases_count),
  ]);

  const datasets = useMemo(() => {
    const arrays = Array.from({ length: 5 }, () => Array(isMobile ? 6 : 12).fill(0));
    arrays.forEach((array, i) => {
      array?.forEach((_, j) => {
        const value = top5Events?.events?.[i]?.purchases?.[String(j)];
        if (value) {
          array.splice(j - 1, 1, value.toFixed(2));
        }
      });
    });

    return arrays.reverse().map((array, index) => {
      return {
        data: array,
        borderWidth: 1,
        backgroundColor: topFiveColors[index],
        barPercentage: 0.6,
        categoryPercentage: 1,
      };
    });
  }, [top5Events, firstHalfYear, isTablet]);

  const barChartData: ChartData<"bar"> = {
    labels: isMobile ? months.filter((_month, i) => (firstHalfYear ? i < 6 : i > 5)) : months,
    datasets: datasets,
  };

  const forceRerender = useState({});
  const customTooltip = ({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<"bar"> }) => {
    // Tooltip Element
    let tooltipEl = document.getElementById("chartjs-tooltip");
    if (tooltipEl) tooltipEl.style.display = "flex";
    if (tooltipEl) tooltipEl.style.alignItems = "start";

    const info = document.getElementById("info");

    if (tooltipEl && !tooltipEl.contains(info)) {
      const child = document.createElement("img");
      child.setAttribute("src", "/info.svg");
      child.id = "info";
      tooltipEl.prepend(child);
      forceRerender[1]({});
    }

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.id = "chartjs-tooltip";
      tooltipEl.innerHTML = "<table></table>";
      document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = "0";

      return;
    }

    // Set caret Position
    tooltipEl.classList.remove("above", "below", "no-transform");
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    } else {
      tooltipEl.classList.add("no-transform");
    }

    const titleLines = tooltipEl.getElementsByTagName("h3");
    for (let i = 0; i < titleLines.length; i++) {
      titleLines[i].style.fontWeight = "500";
      titleLines[i].style.margin = "0";
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b: { lines: string[] }) => b.lines);
      let innerHtml = "<div>";

      titleLines.forEach((title: string) => {
        innerHtml += "<tr><td>" + title + "</td></tr>";
      });
      innerHtml += "</div><tbody>";
      bodyLines.forEach((body: string[], i: number) => {
        const colors = tooltip.labelColors[i];
        let style = "background:" + colors.backgroundColor;
        style += "; border-color:" + colors.borderColor;
        style += "; border-width: 2px";
        const span = '<span style="' + style + '"></span>';
        innerHtml += "<tr><td>" + span + body + "</td></tr>";
      });
      innerHtml += "</tbody>";

      const tableRoot = tooltipEl.querySelector("table");
      if (tableRoot) {
        tableRoot.innerHTML = innerHtml;
        tableRoot.style.textAlign = "left";
        tableRoot.style.marginLeft = "16px";

        const titleLines = tableRoot.getElementsByTagName("h3");
        for (let i = 0; i < titleLines.length; i++) {
          titleLines[i].style.fontWeight = "500";
          titleLines[i].style.margin = "0";
        }
      }
    }

    const position = chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = "1";
    tooltipEl.style.borderRadius = " 10px 10px 10px 0px";
    tooltipEl.style.padding = "7px";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX + "px";
    tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY + "px";
    tooltipEl.style.fontSize = "13px";
    tooltipEl.style.fontWeight = "400";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.backgroundColor = "#282B3D";
    tooltipEl.style.borderRadius = "10px 10px 10px 0px;";
    tooltipEl.style.width = "301px";
    tooltipEl.style.width = "301px";
    const children = tooltipEl.querySelectorAll("hr");
    for (let i = 0; i < children.length; i++) {
      children[i].style.border = "1px solid #1E2130";
      children[i].style.width = "222px";
    }
  };

  const barChartOptions: ChartOptions<"bar"> = {
    plugins: {
      tooltip: {
        // Disable the default tooltip
        enabled: false,
        // Use the external custom tooltip
        external: customTooltip,
        // Customize the tooltip title
        callbacks: {
          title: function (context) {
            return (
              // "<img src='./info.svg'/>" +
              monthDictionary[context[0].label as keyof typeof monthDictionary] + " Total Purchases"
            );
          },
          // Customize the tooltip label
          label: function (context) {
            console.log(
              context,
              top5Events?.events?.map(
                (item) => item.purchases[monthIndex[context?.label as keyof typeof monthDictionary]]
              )
            );

            return top5EventsSuccess
              ? "<h3>" +
                  `${separateByThousands(
                    top5Events?.events
                      ?.map(
                        (item) =>
                          item.purchases[monthIndex[context?.label as keyof typeof monthDictionary]]
                      )
                      ?.reduce((acc, curr) => acc + curr, 0) || 0
                  )}` +
                  "</h3>" +
                  "<hr/>" +
                  "<p style='color:#E697FF; margin: 0'>" +
                  top5Events?.events.find(
                    (item) =>
                      item.purchases[monthIndex[context?.label as keyof typeof monthDictionary]] ===
                      context.parsed.y
                  )?.["name"] +
                  "</p>" +
                  "<h3>" +
                  "$ " +
                  separateByThousands(context.parsed.y.toFixed(2)) +
                  "</h3>"
              : "";
          },
        },
      },
    },
  };
  const flattenChartData: number[] = [];
  datasets.map((el) => el.data.map((i) => flattenChartData.push(i)));
  const maxChartValue = flattenChartData.reduce((a, b) => Math.max(a, b), -Infinity);

  const card = (
    <Card my={isMobile ? undefined : "xl"} mx={isTablet ? 20 : undefined}>
      <Card.Section py={isMobile ? 20 : 50} px={30}>
        <Flex
          direction={isMobile ? "column" : "row"}
          justify="space-between"
          mb={isMobile ? 25 : 50}
        >
          <div>
            {!isMobile && (
              <GradientTitle weight={500} size={rem(30)}>
                Top Purchases
              </GradientTitle>
            )}
            <Text size="sm" align="center" mb={isMobile ? "lg" : undefined}>
              Lifetime tickets purchased across all your promoted events (showing Top 5)
            </Text>
          </div>
          <Box p={isTablet ? 10 : undefined} mr={!isTablet ? rem(220) : undefined}>
            <Title order={2} weight={500}>
              $&nbsp;{separateByThousands(top5Events?.total_gross_revenue.toFixed(2))}
            </Title>
            <Text c={"#FFFFFF80"} size={isTablet ? "xs" : "sm"} mb={isMobile ? "md" : undefined}>
              Total Gross Revenue
            </Text>
          </Box>
        </Flex>
      </Card.Section>
      <Flex
        justify="center"
        align="center"
        mb={isMobile ? "xs" : "lg"}
        sx={{
          img: { cursor: "pointer" },
        }}
      >
        <Image
          src={ArrowLeft}
          alt="arrow-left"
          onClick={() => {
            if (!isMobile) {
              setYear((prevState) => prevState - 1);
            } else if (isMobile && firstHalfYear) {
              setYear((prevState) => prevState - 1);
              setFirstHalfYear(false);
            } else {
              setFirstHalfYear(true);
            }
          }}
        />
        <Text size={isMobile ? "xs" : "md"} mx="lg">
          {year} {isMobile && firstHalfYear ? "JAN - JUN" : undefined}{" "}
          {isMobile && !firstHalfYear ? "JUL - DEC" : undefined}
        </Text>

        <Image
          src={ArrowRight}
          alt="arrow-right"
          onClick={() => {
            if (!isMobile) {
              setYear((prevState) => (prevState < currentYear ? prevState + 1 : prevState));
            } else if (isMobile && firstHalfYear) {
              setFirstHalfYear(false);
            } else if (year < currentYear) {
              setYear((prevState) => (prevState < currentYear ? prevState + 1 : prevState));
              setFirstHalfYear(true);
            }
          }}
        />
      </Flex>
      {isMobile ? (
        <HorizontalBar data={barChartData} height={180} stepSize={Math.round(maxChartValue / 4)} />
      ) : (
        <Box h={222} w="100%" maw={780} sx={{ margin: "auto" }} p={20} pos="relative">
          <VerticalBar
            data={barChartData}
            options={barChartOptions}
            stepSize={Math.round(maxChartValue / 5)}
          />
          <Box h={152} w={1} pos="absolute" bg="gray.8" top={30} right={20} />
        </Box>
      )}
      {top5Events?.events.length ? (
        <Box
          sx={{
            overflow: isMobile ? "scroll" : "auto",
          }}
          className={classes.tableRoot}
        >
          <Table fontSize={isMobile ? rem(11) : rem(12)} my={38} w={isMobile ? 600 : "100%"}>
            <thead>
              <tr>
                <th>
                  <Text weight={400} ml={23}>
                    Event
                  </Text>
                </th>
                <th>
                  <Text weight={400}>Total Gross Revenue</Text>
                </th>
                <th>
                  <Text weight={400}>Number of purchases</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {top5Events?.events.map((element, index) => (
                <tr key={index}>
                  <td>
                    <Flex align="center">
                      <Stack mr="sm">
                        <IconSquare size={15} strokeWidth={0} fill={topFiveColors[index]} />
                      </Stack>
                      {element.name}
                    </Flex>
                  </td>
                  <td>$ {separateByThousands(element.revenue.toFixed(2)) || 0}</td>
                  <td>
                    {separateByThousands(
                      Object.keys(element.purchases)
                        .map((item) => element.purchases[item])
                        .reduce((acc, curr) => acc + curr, 0)
                    ) || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      ) : null}
      {!isEmptyArray(statistics) && (
        <>
          <Divider
            labelPosition="left"
            mb={40}
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
            px={isMobile ? 0 : 90}
          >
            {eventsSuccess && (
              <EventStatistics
                data={statistics ?? []}
                activePage={page}
                titles={["Event", "Total Gross Revenue", "Number of purchases"]}
                isFinancialData
              />
            )}
          </Collapse>
          {eventsSuccess && events.meta.total_count > 0 && showMore && (
            <Pagination
              value={page}
              onChange={setPage}
              total={events.meta.total_count / 10 > 1 ? events.meta.total_count / 10 : 1}
              size="sm"
              position="center"
              my={40}
            />
          )}
        </>
      )}
    </Card>
  );

  return (!eventsIsInitialLoading || !top5EventsIsInitialLoading) && (!!top5Events || !!events) ? (
    isMobile ? (
      <>
        <Flex justify="space-between" align="center" onClick={() => toggleCard()}>
          <Text size="md" m="xl" weight={500}>
            Top Purchases
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
