import { getOrganizationPromotersList } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { IOrganizationPromoterItem } from "@/types";
import { organizationPromotersKey } from "@/utils";
import { ActionIcon, Menu, Modal } from "@mantine/core";
import { Box, Flex, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconEye } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import Image from "next/image";
import { useMemo, useState } from "react";

import { GradientTitle } from "@/components";

import { RemovePromoterModal } from "../event/publish/RemovePromoterModal";
import TrashSvg from "./assets/trash-icon.svg";
import {
  IOrganizationPromoterProps,
  OrganizationPromoterEventList,
} from "./OrganizationPromotersEventList";

const TrashIcon = () => <Image src={TrashSvg} alt="edit" />;

export const OrganizationPromoterList = () => {
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [removeOpened, { open: openRemove, close: closeRemove }] = useDisclosure(false);

  const [activePromoter, setActivePromoter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { isMobile } = useBreakpoint();

  const {
    data: promotersData = [],
    isLoading: isPromotersLoading,
    isSuccess: isPromotersSuccess,
  } = useQuery(
    [organizationPromotersKey],
    () => getOrganizationPromotersList().then((res) => res.data.reverse()),
    {
      initialData: queryClient.getQueryData([organizationPromotersKey]),
    }
  );

  const activePromoterData = promotersData?.find((item) => item.id === activePromoter);

  const columns = useMemo<MRT_ColumnDef<IOrganizationPromoterItem>[]>(
    () => [
      {
        accessorFn: (row) => `${row?.first_name || ""} ${row?.last_name || ""}`,
        header: "Name",
      },
      {
        accessorFn: (row) => row?.email,
        header: "Email",
      },
      {
        accessorKey: "username",
        header: "Username",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: promotersData as IOrganizationPromoterItem[],
    paginationDisplayMode: "pages",
    enableRowNumbers: true,
    enableRowActions: true,
    positionActionsColumn: "first",
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
    renderEmptyRowsFallback: (_props) => (
      <Flex direction={"column"} mih={rem(80)} justify={"center"}>
        <Text
          c={"#FFFFFF4D"}
          size={isMobile ? rem(16) : rem(24)}
          lh={rem(25)}
          fw={400}
          my={rem(11)}
        >
          There are currently no promoters for this event.
        </Text>
      </Flex>
    ),

    renderRowActions: ({ row }) => (
      <Menu
        shadow="md"
        width={rem(240)}
        position="right-start"
        styles={{
          dropdown: {
            padding: `${rem(6)} !important`,
          },
        }}
      >
        <Menu.Target>
          <ActionIcon>
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            fw={600}
            c={"#FFFFFFCC"}
            h={rem(42)}
            icon={
              <Flex
                sx={{
                  img: {
                    width: rem(24),
                    height: rem(24),
                  },
                }}
              >
                <TrashIcon />
              </Flex>
            }
            onClick={() => {
              setActivePromoter(row?.original?.id);
              openRemove();
            }}
          >
            Remove
          </Menu.Item>
          <Menu.Item
            fw={600}
            c={"#FFFFFFCC"}
            h={rem(42)}
            icon={
              <IconEye color="#7791F9" stroke={1.5} style={{ width: rem(24), height: rem(24) }} />
            }
            onClick={() =>
              setActivePromoter(() => {
                openView();

                return row?.original?.id;
              })
            }
          >
            View
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
    state: {
      isLoading: isPromotersLoading,
    },
  });

  return (
    <Box
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

      <RemovePromoterModal
        opened={removeOpened}
        onClose={closeRemove}
        type="organization"
        promoterId={activePromoter as string}
        promoterName={
          (promotersData?.find((item) => item.id === activePromoter)?.username as string) ||
          "this promoter"
        }
      />
      <Modal
        centered
        size={rem(1260)}
        closeButtonProps={{
          sx: {
            svg: {
              width: rem(36),
              height: rem(36),
              flexShrink: 0,
            },
          },
        }}
        styles={{
          content: { backgroundColor: "#282b3d" },
          header: {
            padding: rem(30),
            backgroundColor: "#282B3D",
          },
        }}
        opened={viewOpened}
        onClose={closeView}
        title={
          <Flex direction={"column"}>
            <GradientTitle fz={rem(30)}>
              {activePromoterData?.first_name} {activePromoterData?.last_name}
            </GradientTitle>
            <Text fw={500} fz={rem(12)} c={"#FFFFFFB2"}>
              {activePromoterData?.username}
            </Text>
          </Flex>
        }
      >
        {isPromotersSuccess && promotersData && (
          <OrganizationPromoterEventList
            promoterData={
              promotersData
                ?.map((item) => ({
                  id: item.id,
                  first_name: item.first_name,
                  last_name: item.last_name,
                  email: item.email,
                }))
                .find((item) => item.id === activePromoter) as IOrganizationPromoterProps
            }
          />
        )}
      </Modal>
    </Box>
  );
};
