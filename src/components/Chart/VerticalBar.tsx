import { kFormatter } from "@/utils";
import { useMantineTheme } from "@mantine/core";
import merge from "lodash/merge";
import React from "react";
import { Bar, ChartProps } from "react-chartjs-2";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

export const VerticalBar = React.forwardRef<
  ChartJSOrUndefined<"bar">,
  Omit<ChartProps<"bar">, "type"> & { stepSize: number }
>(({ data, options, stepSize, ...rest }, ref) => {
  const theme = useMantineTheme();
  const defaultOptions: ChartProps<"bar">["options"] = {
    interaction: {
      mode: "point",
    },
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
      tooltip: {
        mode: "point",
        filter: function (tooltipItem, index) {
          return index === 0;
        },
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          color: theme.colors.gray[8],
          drawTicks: false,
        },
      },
      y: {
        min: 0,
        ticks: {
          stepSize: stepSize,
          callback: (value: number | string) => kFormatter(value as number),
        },
        grid: {
          color: theme.colors.gray[8],
          drawTicks: false,
        },
      },
    },
  };

  return <Bar options={merge(defaultOptions, options)} data={data} {...rest} ref={ref} />;
});
