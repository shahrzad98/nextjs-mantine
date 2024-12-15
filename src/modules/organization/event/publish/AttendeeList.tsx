import { useBreakpoint } from "@/hooks";
import { IEventAttendee } from "@/types";
import {
  Accordion,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Text,
  rem,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconDownload, IconX } from "@tabler/icons-react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_Row,
} from "mantine-react-table";
import { FC, useMemo, useRef } from "react";
import QRCode from "react-qr-code";

interface IAttendeeListProps {
  data: IEventAttendee[];
}

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const TicketItem = ({
  qrCode,
  status,
  index,
}: {
  qrCode: string;
  status: string;
  index: number;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const qrCodeImageRef = useRef(null);

  const downloadQRCode = () => {
    const svg = document.getElementById("qr_code");
    if (svg && svg.tagName === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrCode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    }
  };

  return (
    <>
      <Flex justify={"space-between"} align={"center"} py={5} pr={"md"}>
        <Flex align={"center"} gap={"md"}>
          <Flex
            justify={"center"}
            align={"center"}
            w={38}
            h={38}
            bg={"#fff"}
            onClick={open}
            sx={{ cursor: "pointer" }}
          >
            <QRCode size={34} value={qrCode} />
          </Flex>
          <Text c={"#FFFFFFCC"}>Ticket {index}</Text>
        </Flex>
        <Flex align={"center"} w={190}>
          {status === "active" ? (
            <Badge>Not Scanned</Badge>
          ) : (
            <Badge leftSection={<IconCheck />} color="green">
              Scanned
            </Badge>
          )}
        </Flex>
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size={272}
        withCloseButton={false}
        styles={{
          content: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Flex justify={"center"} direction={"column"}>
          <Flex justify={"flex-end"} align={"center"} mb={"md"}>
            <Flex align={"center"} sx={{ cursor: "pointer" }} onClick={close}>
              <Text c={"#fff"} fw={300} mr={rem(5)}>
                Close
              </Text>
              <IconX color="#fff" />
            </Flex>
          </Flex>
          <Flex w={236} h={236} align={"center"} justify={"center"} bg={"#fff"}>
            <QRCode
              crossOrigin={"anonymous"}
              size={227}
              value={qrCode}
              id="qr_code"
              ref={qrCodeImageRef}
            />
          </Flex>
          <Group position="center">
            <Button
              mt={rem(36)}
              variant="gradient"
              fw={300}
              w={141}
              gradient={{ from: "#3077F3", to: "#15AABF" }}
              leftIcon={<IconDownload />}
              onClick={() => downloadQRCode()}
            >
              Download
            </Button>
          </Group>
        </Flex>
      </Modal>
    </>
  );
};

export const AttendeeList: FC<IAttendeeListProps> = ({ data }) => {
  const { isMobile } = useBreakpoint();
  const columns = useMemo<MRT_ColumnDef<IEventAttendee>[]>(
    () => [
      {
        accessorFn: (row) => `${row.first_name} ${row.last_name}`, //access nested data with dot notation
        header: "Full Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorFn: (row) =>
          row.purchases
            .map((purchase) => purchase.tickets.length)
            .reduce((acc, current) => acc + current, 0),
        header: "# of Purchases",
      },
      {
        accessorFn: (row) =>
          row.purchases
            .map(
              (purchase) => purchase.tickets.filter((ticket) => ticket.status !== "active").length
            )
            .reduce((acc, current) => acc + current, 0),
        Cell: ({ cell, row }) =>
          `${cell.getValue() as number}/${row.original.purchases
            .map((purchase) => purchase.tickets.length)
            .reduce((acc, current) => acc + current, 0)}`,
        header: "Scanned",
      },
    ],
    []
  );

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(
      data.map((item) => ({
        full_name: `${item.first_name} ${item.last_name}`,
        email: item.email,
        tickets_purchased: item.purchases.length,
        scanned: item.purchases.length,
      }))
    );
    download(csvConfig)(csv);
  };

  const table = useMantineReactTable({
    columns,
    data,
    paginationDisplayMode: "pages",
    mantineTableHeadCellProps: {
      sx: {
        backgroundColor: "#25262b",
      },
    },
    mantinePaperProps: {
      sx: {
        backgroundColor: "#25262b",
        "& > div": {
          backgroundColor: "#25262b",
        },
      },
    },
    mantineTableContainerProps: {
      sx: {
        "thead tr th": {
          color: "#FFFFFF !important",
          backgroundColor: "#25262b",
        },
        "tbody tr td": {
          color: "#FFFFFFCC",
        },
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
    mantineTableBodyRowProps: () => ({
      sx: {
        "& td": {
          backgroundColor: "#292a2f",
        },
      },
    }),
    renderDetailPanel: ({ row }: { row: MRT_Row<IEventAttendee> }) => (
      <Accordion
        chevronPosition="left"
        styles={{
          content: {
            padding: 0,
            paddingLeft: rem(92),
          },
          control: {
            paddingLeft: rem(55),
          },
        }}
      >
        {row.original.purchases.map((purchase) => (
          <Accordion.Item bg={"#25262b"} value={purchase.id} key={purchase.id}>
            <Accordion.Control>
              <Flex w={"100%"}>
                <Text fz={"0.875rem"} w={220} tt={"uppercase"} c={"#FFFFFFCC"}>
                  {purchase.ticket_tier.name}
                </Text>

                <Text fz={"0.875rem"} w={315} c={"#FFFFFFCC"}>
                  ${purchase.ticket_tier.price.toFixed(2)}
                </Text>
                <Text fz={"0.875rem"} w={"30%"} c={"#FFFFFFCC"}>
                  {purchase.quantity} Tickets
                </Text>
              </Flex>
            </Accordion.Control>
            <Accordion.Panel bg={"#292a2f"}>
              {purchase.tickets.map((ticket, i) => [
                i > 0 && <Divider />,
                <TicketItem
                  key={ticket.id}
                  qrCode={ticket.code}
                  index={i + 1}
                  status={ticket.status}
                />,
              ])}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    ),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "20px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="gradient"
          fw={300}
          w={141}
          gradient={{ from: "#3077F3", to: "#15AABF" }}
          leftIcon={<IconDownload />}
          onClick={handleExportData}
        >
          Download
        </Button>
      </Box>
    ),
  });

  return (
    <Box
      mt={isMobile ? rem(34) : rem(50)}
      sx={{
        overflow: isMobile ? "auto" : undefined,
        ".mantine-Paper-root": {
          width: isMobile ? rem(1027) : undefined,
          "& > div:nth-of-type(3)": {
            "& > div:nth-of-type(2)": {
              justifyContent: "flex-start !important",
              ".mantine-InputWrapper-root": {
                display: "flex",
                alignItems: "center",
                gap: 10,
              },
            },
          },
        },
        "tbody tr td.mantine-TableBodyCell-DetailPanel": {
          padding: "0 !important",
          transition: "none !important",
          "&:hover": {
            backgroundColor: "#1a1b1e",
          },
        },
      }}
    >
      <MantineReactTable table={table} />
    </Box>
  );
};
