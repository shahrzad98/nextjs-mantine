import React, { FC } from "react";
import { ChartProps, Pie } from "react-chartjs-2";

export const PieChart: FC<Omit<ChartProps<"pie">, "type">> = ({ data, options, ...rest }) => {
  return (
    <Pie
      options={
        options ?? {
          maintainAspectRatio: false,
          responsive: true,
        }
      }
      data={data}
      {...rest}
    />
  );
};
