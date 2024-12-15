import { useBreakpoint } from "@/hooks";
import { separateByThousands } from "@/utils";
import { Box, createStyles, Flex, Stack, Table, Text } from "@mantine/core";
import { auto } from "@popperjs/core";
import React, { FC } from "react";

const useStyles = createStyles(() => ({
  root: {
    ".mantine-Table-root": {
      "tbody tr:nth-child(odd)": {
        backgroundColor: "#292A2F",
      },
    },
  },
}));

interface IEventStatisticsProps {
  data: Array<any>;
  titles: Array<string>;
  activePage: number;
  isFinancialData?: boolean;
}

export const EventStatistics: FC<IEventStatisticsProps> = ({
  data,
  titles,
  activePage,
  isFinancialData = false,
}) => {
  const { isMobile, isDesktop } = useBreakpoint();
  const { classes } = useStyles();

  return (
    <>
      <Box w={isMobile ? 600 : auto} className={classes.root}>
        <Table
          fontSize="xs"
          sx={{
            "& .title": {
              width: isDesktop ? 300 : 150,
            },
            "& tr": {
              borderBottom: "1px solid var(--Stroke, #373A3F)",
            },
          }}
        >
          <thead>
            <tr>
              {titles.map((title, index) => (
                <th key={index}>
                  <Text size={13} weight={400} ml={index == 0 ? "md" : undefined}>
                    {title}
                  </Text>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="title">
                  <Flex align="center">
                    <Stack mr="sm">{(activePage - 1) * 10 + index + 1}</Stack>{" "}
                    <Text lineClamp={1} maw={isDesktop ? 300 : 150}>
                      {row[0]}
                    </Text>
                  </Flex>
                </td>
                {row.map((item: string | number, index: number) => {
                  const formattedValue = isFinancialData
                    ? "$ " + separateByThousands(parseFloat(item as string).toFixed(2))
                    : index === row.length - 1
                    ? item
                    : separateByThousands(item);

                  return index > 0 ? (
                    <td key={index}>
                      {typeof item === "string"
                        ? item
                        : index === row.length - 1 && !isFinancialData && !item
                        ? "0.00"
                        : index === row.length - 1 && !isFinancialData
                        ? Number(formattedValue).toFixed(2)
                        : formattedValue || 0}
                      {index === row.length - 1 && !isFinancialData && " %"}
                    </td>
                  ) : null;
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </>
  );
};
