import { kFormatter } from "@/utils";
import { useMantineTheme } from "@mantine/core";
import { Plugin } from "chart.js";
import React, { FC } from "react";
import { Bar, ChartProps } from "react-chartjs-2";

export const HorizontalBar: FC<
  Omit<ChartProps<"bar">, "type"> & Partial<Plugin> & { stepSize: number }
> = ({ data, options, stepSize, ...rest }) => {
  const noData = data.datasets.every((item) => item.data.every((el) => el === 0));
  const theme = useMantineTheme();
  const defaultOptions: ChartProps<"bar">["options"] = {
    indexAxis: "y" as const,
    interaction: {
      mode: "point",
    },
    scales: {
      y: {
        stacked: true,
        grid: {
          color: theme.colors.dark[8],
          drawTicks: false,
        },
      },
      x: {
        min: 0,
        max: stepSize * 6,
        ticks: {
          stepSize: stepSize,
          callback: (value: number | string) => kFormatter(value as number),
        },
        grid: {
          color: theme.colors.dark[8],
          drawTicks: false,
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "General SMS - 150",
      },
      tooltip: {
        mode: "point",
        position: "nearest",
        filter: function (tooltipItem, index) {
          return index === 0;
        },
      },
      datalabels: {
        display: function (context) {
          return noData ? false : context.datasetIndex === context.chart.data.datasets.length - 1;
        },
        formatter: function (value) {
          return "$ " + value;
        },
        font: {
          weight: 400,
        },
        color: theme.colors.gray[5],
        align: "end",
        anchor: "end",
      },
    },
  };

  return <Bar options={options ?? defaultOptions} data={data} {...rest} />;
};
