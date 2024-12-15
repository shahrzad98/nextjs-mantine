import { getOrganizationPromotersEvents, resendInvitePromoter } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import {
  IUpdatePromoterProps,
  UpdatePromoterModal,
} from "@/modules/organization/event/publish/UpdatePromoterModal";
import { CustomErrorResponse, IOrganizationPromoterEvent } from "@/types";
import {
  errorNotification,
  organizationPromoterEventsKey,
  separateByThousands,
  successNotification,
} from "@/utils";
import { ActionIcon, Badge, Box, Flex, rem } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconEye, IconRefresh } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { RemovePromoterModal } from "../event/publish/RemovePromoterModal";
import PencilSvg from "./assets/pencil-icon.svg";
import TrashSvg from "./assets/trash-icon.svg";

export interface IOrganizationPromoterProps {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const PencilIcon = () => <Image src={PencilSvg} alt="edit" />;
const TrashIcon = () => <Image src={TrashSvg} alt="edit" />;

function isInvitationExpired(date: string) {
  return date && Math.abs(dayjs(date).diff(dayjs(), "day")) > 1;
}

function getStatus({
  status,
  date,
  resendInvite,
}: {
  status: string;
  date: string;
  resendInvite: () => void;
}) {
  let result;
  if (status === "accepted") {
    result = (
      <Badge
        size="xl"
        radius="sm"
        variant="filled"
        styles={{
          root: { backgroundColor: "#28E852", padding: "0 5px" },
          inner: { color: "#25262B", textTransform: "capitalize" },
        }}
      >
        Active
      </Badge>
    );
  } else if (status === "rejected") {
    result = (
      <Badge
        size="xl"
        radius="sm"
        variant="filled"
        styles={{
          root: { backgroundColor: "#EC2323", padding: "0 5px" },
          inner: { color: "#25262B", textTransform: "capitalize" },
        }}
      >
        Rejected
      </Badge>
    );
  } else if (status === "pending" && isInvitationExpired(date)) {
    result = (
      <Flex align={"center"} gap={rem(24)}>
        <Badge
          size="xl"
          radius="sm"
          variant="filled"
          styles={{
            root: { backgroundColor: "#FF6969", padding: "0 5px" },
            inner: { color: "#25262B", textTransform: "capitalize" },
          }}
        >
          Invitation Expired
        </Badge>
        <Tooltip label="Resend Invitation">
          <ActionIcon onClick={() => resendInvite()}>
            <IconRefresh color="#728AEC" />
          </ActionIcon>
        </Tooltip>
      </Flex>
    );
  } else {
    result = (
      <Badge
        size="xl"
        radius="sm"
        variant="filled"
        styles={{
          root: { backgroundColor: "#BD8AFF", padding: "0 5px" },
          inner: { color: "#25262B", textTransform: "capitalize" },
        }}
      >
        Pending Acceptance
      </Badge>
    );
  }

  return result;
}

function useResendInvitePromoter() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ eventId, promoterId }: { eventId: string; promoterId: string }) =>
      resendInvitePromoter({ eventId, promoterId }).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [organizationPromoterEventsKey] });
        successNotification({
          title: "Success!",
          message: `The invitation has been resent.`,
        });
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );
}

function useGetEvents(promoterId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [organizationPromoterEventsKey],
    queryFn: async () => getOrganizationPromotersEvents(promoterId).then((res) => res.data),
    initialData: queryClient.getQueryData([organizationPromoterEventsKey]),
  });
}

export const OrganizationPromoterEventList = ({
  promoterData,
}: {
  promoterData: IOrganizationPromoterProps;
}) => {
  const { isMobile } = useBreakpoint();

  const router = useRouter();

  const [removeOpened, { open: openRemove, close: closeRemove }] = useDisclosure(false);
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  const {
    data: eventsData = [],
    isError: isLoadingEventsError,
    isFetching: isFetchingEvents,
    isLoading: isLoadingEvents,
    isSuccess: isLoadingEventsSuccess,
  } = useGetEvents(promoterData.id);

  const activeEventData = eventsData?.find((item) => item.id === activeEvent);

  const { mutate: handleResendInvite } = useResendInvitePromoter();

  const columns = useMemo<MRT_ColumnDef<IOrganizationPromoterEvent>[]>(
    () => [
      {
        accessorFn: (row) => row.event_name,
        header: "Event",
      },
      {
        accessorFn: (row) =>
          row.commission_type === "percentage"
            ? `${row.commission_amount}%`
            : `$ ${separateByThousands(row.commission_amount as number)}`,
        header: "Commission",
      },
      {
        accessorFn: (row) => row?.event_promoter_views_count,
        header: "Number of Views",
      },

      {
        accessorFn: (row) => row?.purchases_count,
        header: "Number of Purchases",
      },
      {
        accessorFn: (row) =>
          getStatus({
            status: row?.status as string,
            date: row?.invitation_sent_at as string,
            resendInvite: () => handleResendInvite({ eventId: row.event_id, promoterId: row.id }),
          }),
        header: "Status",
        id: "promoter_status",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: eventsData,
    paginationDisplayMode: "pages",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Action",
      },
    },
    enableRowActions: true,
    state: {
      isLoading: isLoadingEvents,
      showAlertBanner: isLoadingEventsError,
      showProgressBars: isFetchingEvents,
    },
    mantinePaperProps: {
      sx: {
        backgroundColor: "#292A2F",
        "& > div": {
          backgroundColor: "#292A2F",
        },
      },
    },
    enableTopToolbar: false,
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
    mantineTableBodyRowProps: () => ({
      sx: {
        "& td": {
          backgroundColor: "#292A2F",
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
    renderRowActions: ({ row }) => (
      <Menu
        shadow="md"
        width={rem(240)}
        position="right-start"
        withinPortal
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
              <IconEye color="#7791F9" stroke={1.5} style={{ width: rem(24), height: rem(24) }} />
            }
            onClick={() =>
              router.push(
                `/organization/event/${row?.original?.event_id}/promoter/${row?.original?.id}`
              )
            }
          >
            View
          </Menu.Item>

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
                <PencilIcon />
              </Flex>
            }
            onClick={() => {
              setActiveEvent(row?.original?.id);
              openUpdate();
            }}
          >
            Update Commission
          </Menu.Item>

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
              setActiveEvent(row?.original?.id);
              openRemove();
            }}
          >
            Remove
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
  });

  return (
    <Box
      mt={isMobile ? rem(34) : rem(20)}
      px={rem(34)}
      mb={rem(24)}
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
      {isLoadingEventsSuccess && activeEvent && (
        <>
          <UpdatePromoterModal
            opened={updateOpened}
            onClose={() => {
              closeUpdate();
              setActiveEvent(null);
            }}
            promoter={
              {
                ...promoterData,
                commission_amount: activeEventData?.commission_amount,
                commission_type: activeEventData?.commission_type,
                event_id: activeEventData?.event_id,
                id: activeEventData?.id,
              } as IUpdatePromoterProps
            }
          />
          <RemovePromoterModal
            opened={removeOpened}
            onClose={() => {
              closeRemove();
              setActiveEvent(null);
            }}
            type="event"
            promoterId={activeEventData?.id as string}
            promoterName={
              promoterData?.first_name
                ? `${promoterData?.first_name as string} ${promoterData?.last_name as string}`
                : "this promoter"
            }
            eventId={activeEventData?.event_id}
            keepMounted={false}
          />
        </>
      )}
    </Box>
  );
};
