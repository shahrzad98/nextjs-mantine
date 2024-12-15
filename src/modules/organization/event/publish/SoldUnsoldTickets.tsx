import { useBreakpoint } from "@/hooks";
import { TicketTier } from "@/types";
import { getPercentage, separateByThousands } from "@/utils";
import { Box, Card, createStyles, Flex, Table, Text, Title } from "@mantine/core";
import React, { FC } from "react";

import { GradientTitle } from "@/components";

const useStyles = createStyles((theme) => ({
  root: {
    ".mantine-Table-root": {
      "tr:nth-child(even) , th": {
        backgroundColor: theme.colors.gray[9],
      },
    },
  },
  cursorPointer: {
    cursor: "pointer",
    paddingRight: "20px",
  },
}));

type ISoldUnsoldTicketsProps = {
  isSold: boolean;
  ticketTiers: TicketTier[];
  totalTickets: number;
  sold: number;
};
export const SoldUnsoldTickets: FC<ISoldUnsoldTicketsProps> = ({
  isSold,
  ticketTiers,
  totalTickets,
  sold,
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const { classes } = useStyles();

  const ticketsInfo = ticketTiers.map((ticket) => ({
    title: ticket.name,
    sold: isSold ? ticket.ticket_quantity - ticket.available_tickets : ticket.available_tickets,
    percent: getPercentage(
      isSold ? ticket.ticket_quantity - ticket.available_tickets : ticket.available_tickets,
      ticket.ticket_quantity
    ),
  }));

  return (
    <Card py={44} px={isMobile ? 30 : 69} className={classes.root}>
      <GradientTitle order={3} weight={500}>
        {isSold ? "Sold" : "Unsold"} Tickets
      </GradientTitle>
      <Text mb="xl"> Total: {separateByThousands(totalTickets) || 0}</Text>
      <Flex align="center" mb={30}>
        <Title order={1} weight={500}>
          {isSold ? separateByThousands(sold) || 0 : separateByThousands(totalTickets - sold) || 0}
        </Title>
        <Text size="xs" ml="xs">
          Total Tickets {isSold ? "Sold" : "Unsold"}
        </Text>
      </Flex>
      <Box sx={{ overflow: isTablet ? "scroll" : "auto" }}>
        <Table
          fontSize="xs"
          highlightOnHover
          w={360}
          sx={{
            "& th:first-child": { width: "180px" },
            "& tr:last-child td": {
              borderBottom: "1px solid #373A3F",
            },
          }}
        >
          <thead>
            <tr>
              <th>
                <Text>Ticket Tier</Text>
              </th>
              <th>Tix {isSold ? "Sold" : "Unsold"}</th>
              <th>% {isSold ? "Sold" : "Unsold"}</th>
            </tr>
          </thead>
          <tbody>
            {ticketsInfo.map((element, index) => (
              <tr key={index}>
                <td>{element.title}</td>
                <td>{separateByThousands(element.sold) || 0}</td>
                <td>
                  {isNaN(element.percent) || !element.percent ? "0.00" : element.percent.toFixed(2)}
                  &nbsp; %
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Card>
  );
};
