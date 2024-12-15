import { getEventsPromotersList, invitePromoter, resendInvitePromoter } from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { CustomErrorResponse, IEventPromoter } from "@/types";
import {
  errorNotification,
  eventPromotersKey,
  separateByThousands,
  successNotification,
} from "@/utils";
import { ActionIcon, Badge, Box, Button, Flex, rem } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconEye, IconPlus, IconRefresh } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import PencilSvg from "./assets/pencil-icon.svg";
import TrashSvg from "./assets/trash-icon.svg";
import { InvitePromoterModal } from "./InvitePromoterModal";
import { RemovePromoterModal } from "./RemovePromoterModal";
import { UpdatePromoterModal } from "./UpdatePromoterModal";

const PencilIcon = () => <Image src={PencilSvg} alt="edit" />;
const TrashIcon = () => <Image src={TrashSvg} alt="edit" />;

function isInvitationExpired(date: string) {
  return date && Math.abs(dayjs(date).diff(dayjs(), "hour")) > 24;
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
        Approved
      </Badge>
    );
  } else if (status === "rejected") {
    result = (
      <Badge
        size="xl"
        radius="sm"
        variant="filled"
        styles={{
          root: { backgroundColor: "#FF6969", padding: "0 5px" },
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

function useInvitePromoter({
  eventId,
  setAddedPromoterId,
}: {
  eventId: string;
  setAddedPromoterId: (id: string) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation(
    (values: {
      promoter_id: string;
      email: string;
      commission_type: string;
      commission_amount: number;
    }) =>
      invitePromoter({
        eventId,
        commission_type: values.commission_type,
        commission_amount: values.commission_amount,
        ...(values?.promoter_id ? { promoter_id: values.promoter_id } : { email: values.email }),
      }).then((res) => res.data),
    {
      onSuccess: (invitedPromoter) => {
        setAddedPromoterId(invitedPromoter.id);
        queryClient.invalidateQueries({ queryKey: [eventPromotersKey] });
        successNotification({
          title: "Success!",
          message: `Promoter added.`,
        });
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );
}

function useResendInvitePromoter(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation(
    (promoterId: string) => resendInvitePromoter({ eventId, promoterId }).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [eventPromotersKey] });
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

function useGetPromoters(eventId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [eventPromotersKey],
    queryFn: async () => getEventsPromotersList(eventId).then((res) => res.data.reverse()),
    initialData: queryClient.getQueryData([eventPromotersKey]),
  });
}

export const EventPromoterList = ({ eventId }: { eventId: string }) => {
  const { isMobile } = useBreakpoint();
  const router = useRouter();

  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [removeOpened, { open: openRemove, close: closeRemove }] = useDisclosure(false);
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const [activePromoter, setActivePromoter] = useState<string | null>(null);

  const [addedPromoterId, setAddedPromoterId] = useState<string | null>(null);

  const {
    data: promotersData = [],
    isError: isLoadingPromotersError,
    isFetching: isFetchingPromoters,
    isLoading: isLoadingPromoters,
    isSuccess: isLoadingPromotersSuccess,
  } = useGetPromoters(eventId);

  const activePromoterData = promotersData?.find((item) => item.id === activePromoter);

  useEffect(() => {
    if (addedPromoterId && isLoadingPromotersSuccess) {
      setTimeout(() => {
        setAddedPromoterId(null);
      }, 5000);
    }
  }, [addedPromoterId && isLoadingPromotersSuccess]);

  const { mutate: handleInvite, isLoading: inviteLoading } = useInvitePromoter({
    eventId,
    setAddedPromoterId,
  });

  const { mutate: handleResendInvite } = useResendInvitePromoter(eventId);

  const columns = useMemo<MRT_ColumnDef<IEventPromoter>[]>(
    () => [
      {
        accessorFn: (row) => `${row?.promoter?.first_name || ""} ${row?.promoter?.last_name || ""}`,
        header: "Name",
      },
      {
        accessorFn: (row) => row?.promoter?.email,
        header: "Email",
      },
      {
        accessorFn: (row) => row?.promoter?.username,
        header: "Username",
      },
      {
        accessorFn: (row) =>
          row.commission_type === "percentage"
            ? `${row.commission_amount}%`
            : `$ ${separateByThousands(row.commission_amount as number)}`,
        header: "Commission",
      },
      {
        accessorFn: (row) =>
          getStatus({
            status: row?.status as string,
            date: row?.invitation_sent_at as string,
            resendInvite: () => handleResendInvite(row.id),
          }),
        header: "Status",
        id: "promoter_status",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: promotersData,
    paginationDisplayMode: "pages",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Action",
      },
    },
    enableRowActions: true,
    state: {
      isLoading: isLoadingPromoters,
      showAlertBanner: isLoadingPromotersError,
      showProgressBars: isFetchingPromoters,
    },
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
          backgroundColor: row.original.id === addedPromoterId ? "#00530E" : "#292A2F",
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
              router.push(`/organization/event/${eventId}/promoter/${row?.original?.id}`)
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
              setActivePromoter(row?.original?.id);
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
              setActivePromoter(row?.original?.id);
              openRemove();
            }}
          >
            Remove
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
    renderTopToolbarCustomActions: () => (
      <Button
        variant="gradient"
        gradient={{ from: "#3077F3", to: "#15AABF" }}
        fw={400}
        onClick={openAdd}
        m={rem(20)}
        styles={{
          root: {
            height: rem(34),
          },
        }}
        leftIcon={<IconPlus />}
      >
        Add Promoter
      </Button>
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
      <InvitePromoterModal
        opened={addOpened}
        onClose={closeAdd}
        onModalSubmit={handleInvite}
        submitLoading={inviteLoading}
      />
      {isLoadingPromotersSuccess && activePromoterData && (
        <>
          <UpdatePromoterModal
            opened={updateOpened}
            onClose={() => {
              closeUpdate();
              setActivePromoter(null);
            }}
            promoter={{
              email: activePromoterData?.promoter?.email as string,
              commission_amount: activePromoterData?.commission_amount as number,
              commission_type: activePromoterData?.commission_type as string,
              event_id: activePromoterData?.event_id as string,
              first_name: activePromoterData?.promoter?.first_name as string,
              last_name: activePromoterData?.promoter?.last_name as string,
              id: activePromoter as string,
            }}
            keepMounted={false}
          />
          <RemovePromoterModal
            opened={removeOpened}
            onClose={() => {
              closeRemove();
              setActivePromoter(null);
            }}
            type="event"
            promoterId={activePromoter as string}
            promoterName={(activePromoterData?.promoter?.username as string) || "this promoter"}
            eventId={eventId}
            keepMounted={false}
          />
        </>
      )}
    </Box>
  );
};
