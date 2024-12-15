import { refundPurchase } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { IPurchase } from "@/types/purchase";
import { errorNotification, getEventDateTimeInfo, successNotification } from "@/utils";
import { ActionIcon, Button, Text, Title, Tooltip, rem, Loader, Modal, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconReceiptRefund } from "@tabler/icons-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  MRT_ColumnDef,
  MRT_Row,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";

import { TicketListItem } from "./TicketListItem";

interface IEventListProps {
  purchases: IPurchase[];
  addedEventId?: string;
  refetchTickets: () => void;
  isLoadingPurchasesError: boolean;
  isFetchingPurchases: boolean;
  isLoadingPurchases: boolean;
  isLoadingPurchasesSuccess: boolean;
}

export const TicketList = ({
  purchases,
  addedEventId,
  refetchTickets,
  isLoadingPurchasesError,
  isFetchingPurchases,
  isLoadingPurchases,
  isLoadingPurchasesSuccess,
}: IEventListProps) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const { isMobile } = useBreakpoint();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [refundOpened, { open: refundOpen, close: refundClose }] = useDisclosure(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefund = (id: string) => {
    setLoading(true);
    refundPurchase(id)
      .then((response) => {
        if (response.data.status === "succeeded") {
          successNotification({
            title: "Successful!",
            message:
              "Your refund request has been successfully submitted and will be processed within the next 72 hours.",
          });
          refetchTickets();
        }
      })
      .catch((e) => errorNotification(e))
      .finally(() => {
        setLoading(false);
        refundClose();
      });
  };

  useEffect(() => {
    if (addedEventId && isLoadingPurchasesSuccess) {
      setAddedItem(addedEventId);
      setTimeout(() => {
        setAddedItem(null);
      }, 5000);
    }
  }, [addedEventId && isLoadingPurchasesSuccess]);

  const columns = useMemo<MRT_ColumnDef<IPurchase>[]>(
    () => [
      {
        accessorFn: (row) => row?.event?.name,
        header: "Event Name",
      },
      {
        accessorFn: (row) => row.tickets?.length,
        header: "# of Tickets",
      },
      {
        accessorFn: (row) => row.ticket_tier?.name,
        header: "Ticket Tier",
      },

      {
        accessorFn: (row) =>
          `${
            getEventDateTimeInfo(
              row.ticket_tier.start_at,
              undefined,
              row.event.time_zone.utc_offset
            ).weekday
          }, ${
            getEventDateTimeInfo(
              row.ticket_tier.start_at,
              undefined,
              row.event.time_zone.utc_offset
            ).date
          }`,
        header: "Event Date",
      },
    ],
    [addedItem]
  );

  const table = useMantineReactTable({
    columns,
    data: purchases,
    paginationDisplayMode: "pages",
    editDisplayMode: "row",
    enableEditing: false,
    state: {
      isLoading: isLoadingPurchases,
      showAlertBanner: isLoadingPurchasesError,
      showProgressBars: isFetchingPurchases,
    },

    renderRowActions: ({ row }) =>
      row.original.status === "refundable" && (
        <>
          <Tooltip
            label="Refund My Ticket Purchase"
            styles={{
              tooltip: {
                backgroundColor: "#282B3D",
                border: "1px solid #1E2130",
                color: "#fff",
                padding: rem(12),
              },
            }}
            transitionProps={{ transition: "pop-bottom-right" }}
            events={{ hover: true, focus: true, touch: true }}
          >
            <ActionIcon onClick={refundOpen}>
              <IconReceiptRefund />
            </ActionIcon>
          </Tooltip>
          <Modal
            closeOnClickOutside={!loading}
            withCloseButton={false}
            centered
            size={rem(446)}
            opened={refundOpened}
            onClose={refundClose}
            sx={{
              "& .mantine-Modal-body": {
                paddingLeft: rem(50),
                paddingRight: rem(50),
              },
            }}
          >
            <Title order={4} size={rem(24)} mt={rem(26)} mb={rem(24)} align="center">
              Refund Your Ticket Purchase?
            </Title>
            <Text size={rem(14)}>
              You are about to receive a refund for your ticket purchase and the tickets will be
              released and made available for sale again.
              <br />
              <br />
              Are you sure that you want to be refunded?
            </Text>
            <Flex justify="center" mt={rem(40)} mb={rem(26)} gap={rem(25)}>
              <Button
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                h={rem(44)}
                fs={rem(15)}
                fw={400}
                onClick={!loading ? refundClose : () => null}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                h={rem(44)}
                fs={rem(15)}
                fw={400}
                onClick={() => handleRefund(row.original.id)}
              >
                {loading ? <Loader size="sm" /> : "Refund Me"}
              </Button>
            </Flex>
          </Modal>
        </>
      ),
    renderDetailPanel: ({ row }: { row: MRT_Row<IPurchase> }) =>
      row.original.tickets.map((ticket) => (
        <TicketListItem
          key={ticket.id}
          ticket={ticket}
          purchase={row.original}
          isMobile={isMobile}
          refetch={refetchTickets}
        />
      )),
    mantinePaperProps: {
      sx: {
        backgroundColor: "#292A2F",
        "& > div": {
          backgroundColor: "#292A2F",
        },
      },
    },
    mantineTableContainerProps: {
      sx: {
        "thead tr th": {
          color: "#FFFFFF !important",
          backgroundColor: "#292A2F",
        },
        "tbody tr td": {
          color: "#FFFFFFCC",
        },
      },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      sx: {
        "& td": {
          backgroundColor: row.original.id === addedItem ? "#00530E" : "#292A2F",
        },
        "& .mantine-TableBodyCell-DetailPanel": {
          padding: "0 !important",
        },
      },
    }),
    mantineToolbarAlertBannerProps: {
      sx: {
        display: "none",
      },
    },
    mantineTopToolbarProps: {
      sx: {
        "& > div:nth-of-type(2)": {
          display: "flex",
          alignItems: "center",
          paddingRight: 20,
        },
      },
    },

    mantineBottomToolbarProps: {
      sx: {
        "& > div:last-of-type ": {
          justifyContent: "center",
          "& > div": {
            right: "auto",
          },
        },
      },
    },
  });

  return <MantineReactTable table={table} />;
};
