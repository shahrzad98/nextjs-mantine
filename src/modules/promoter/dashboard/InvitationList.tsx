import { getInvitations, updateInvitation } from "@/api/handler/promoter";
import { CustomErrorResponse, IPromoterInvitation } from "@/types";
import { errorNotification, promoterInvitationsKey, successNotification } from "@/utils";
import { Button } from "@mantine/core";
import { rem } from "@mantine/core";
import { Flex } from "@mantine/core";
import { Text } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { MRT_ColumnDef, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useMemo } from "react";

function isInvitationExpired(date: string) {
  return date && Math.abs(dayjs(date).diff(dayjs(), "day")) > 1;
}

function getStatus({ status, date }: { status: string; date: string }) {
  let result;
  if (status === "accepted") {
    result = <Text c={"#28E852"}>Accepted</Text>;
  } else if (status === "rejected") {
    result = <Text c={"#EC2323"}>Rejected</Text>;
  } else if (status === "pending" && isInvitationExpired(date)) {
    result = <Text c={"#EC2323"}>Expired</Text>;
  } else {
    result = <Text c={"#BD8AFF"}>Pending</Text>;
  }

  return result;
}

function useGetInvitations() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [promoterInvitationsKey],
    queryFn: async () => getInvitations().then((res) => res.data),
    initialData: queryClient.getQueryData([promoterInvitationsKey]),
  });
}

function useUpdateInvitation() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ status, id }: { id: string; status: string }) =>
      updateInvitation({ id, status }).then((res) => res.data),
    {
      onSuccess: ({ status }) => {
        queryClient.invalidateQueries({ queryKey: [promoterInvitationsKey] });
        successNotification({
          title: "Success!",
          message:
            status === "rejected"
              ? `You have rejected the invitaion successfully.`
              : `You have accepted the invitaion successfully.`,
        });
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );
}

export const InvitationList = () => {
  const {
    data: invitationsData = [],
    isError: isLoadingInvitationsError,
    isFetching: isFetchingInvitations,
  } = useGetInvitations();

  const { mutate: handleUpdateInvitation, isLoading: updateInvitationLoading } =
    useUpdateInvitation();

  const columns = useMemo<MRT_ColumnDef<IPromoterInvitation>[]>(
    () => [
      {
        accessorFn: (row) => row.event.name,
        id: "event_name",
        header: "Event",
      },

      {
        accessorFn: (row) => row.event.organization.name,
        id: "organization_name",
        header: "Organization",
      },

      {
        accessorFn: (row) =>
          `${row.commission_type === "amount" ? "$" : ""}${row.commission_amount}${
            row.commission_type === "percentage" ? "%" : ""
          }`,
        id: "commission_amount",
        header: "Commission",
      },

      {
        accessorFn: (row) => row.status,
        id: "status",
        header: "Status",
        Cell: ({ row }) =>
          getStatus({
            status: row.original.status as string,
            date: row.original.invitation_sent_at as string,
          }),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: invitationsData,
    paginationDisplayMode: "pages",
    enableRowNumbers: true,
    enableRowActions: true,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Action",
      },
    },
    enableDensityToggle: false,
    positionActionsColumn: "last",
    state: {
      density: "xs",
      isLoading: isLoadingInvitationsError,
      showAlertBanner: isLoadingInvitationsError,
      showProgressBars: isFetchingInvitations,
    },
    mantinePaperProps: {
      sx: {
        boxShadow: "none",
        border: "0 !important",
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
    renderRowActions: ({ row }) => (
      <Flex align={"center"} gap={rem(20)}>
        <Button
          variant="gradient"
          fw={400}
          gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
          disabled={
            row.original?.status === "rejected" ||
            row.original?.status === "accepted" ||
            Boolean(
              row.original?.status === "pending" &&
                isInvitationExpired(row.original.invitation_sent_at as string)
            )
          }
          sx={{
            "&[disabled]": {
              backgroundColor: "#FFFFFF4D",
              color: "#9DA1A4",
            },
          }}
          onClick={() => handleUpdateInvitation({ id: row.original.id, status: "accepted" })}
          loading={updateInvitationLoading}
        >
          Accept
        </Button>
        <Button
          c={"#E03130"}
          styles={{ root: { borderColor: "#E03130" } }}
          variant="outline"
          disabled={row.original?.status === "rejected" || row.original?.status === "accepted"}
          sx={{
            "&[disabled]": {
              borderColor: "#FFFFFF4D",
              backgroundColor: "transparent",
              color: "#FFFFFF4D",
            },
          }}
          onClick={() => handleUpdateInvitation({ id: row.original?.id, status: "rejected" })}
          loading={updateInvitationLoading}
        >
          Reject
        </Button>
      </Flex>
    ),
  });

  return <MantineReactTable table={table} />;
};
