import { getOrganizations, updateOrganization } from "@/api/handler/admin";
import { IOrganizationListItem } from "@/types/organization";
import { errorNotification, organizationListKey, successNotification } from "@/utils";
import { Button } from "@mantine/core";
import { Badge, rem } from "@mantine/core";
import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import PencilSvg from "./assets/pencil-icon.svg";

const PencilIcon = () => <Image src={PencilSvg} alt="edit" />;

interface IOrganizationListProps {
  addedOrganizationId: string | null;
  onResendInvite: (id: string) => void;
  openAddModal: () => void;
}

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
  if (status === "active") {
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
  } else if (status === "invitation_sent" && isInvitationExpired(date)) {
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

function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (organization) =>
      updateOrganization({
        id: organization.id,
        commission_percentage: organization.commission_percentage as number,
      }).then((res) => res.data),
    onMutate: (newOrganizationInfo: IOrganizationListItem) => {
      queryClient.setQueryData(
        [organizationListKey],
        (prevOrganizations: IOrganizationListItem[] | undefined) =>
          prevOrganizations?.map((prevOrganization: IOrganizationListItem) =>
            prevOrganization.id === prevOrganization.id ? newOrganizationInfo : prevOrganization
          )
      );
    },
    onSuccess: (_response, variables) => {
      successNotification({
        title: `Commission percentage successfully updated for ${
          variables.name || variables.owner?.email
        }.`,
        message: "Future events created by the organization will reflect the new rate.",
      });
      queryClient.invalidateQueries({ queryKey: [organizationListKey] });
    },
  });
}

function useGetOrganizations() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [organizationListKey],
    queryFn: async () => getOrganizations().then((res) => res.data),
    initialData: queryClient.getQueryData([organizationListKey]),
  });
}

export const OrganizationList = ({
  addedOrganizationId,
  onResendInvite,
  openAddModal,
}: IOrganizationListProps) => {
  const router = useRouter();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const { query } = router.query;
  const decodedQuery = query && decodeURIComponent(query as string);

  const {
    data: organizationData = [],
    isError: isLoadingOrganizationsError,
    isFetching: isFetchingOrganizations,
    isLoading: isLoadingOrganizations,
    isSuccess: isLoadingOrganizationsSuccess,
  } = useGetOrganizations();

  const resultData: IOrganizationListItem[] = isLoadingOrganizationsSuccess
    ? decodedQuery
      ? organizationData.filter(
          (item) =>
            item?.owner?.email?.includes(decodedQuery as string) ||
            item?.name?.includes(decodedQuery as string) ||
            item?.invited_by?.email?.includes(decodedQuery as string)
        )
      : organizationData
    : [];

  useEffect(() => {
    if (addedOrganizationId && isLoadingOrganizationsSuccess) {
      setAddedItem(addedOrganizationId);
      setTimeout(() => {
        setAddedItem(null);
      }, 5000);
    }
  }, [addedOrganizationId && isLoadingOrganizationsSuccess]);

  const { mutateAsync: updateOrganization, isLoading: isUpdatingOrganization } =
    useUpdateOrganization();

  const columns = useMemo<MRT_ColumnDef<IOrganizationListItem>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "organization_name",
        header: "Organization",
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.owner?.email,
        id: "organization_email",
        header: "Email",
        enableEditing: false,
      },

      {
        accessorFn: (row) => row.invited_by?.email,
        id: "organization_invited_by",
        header: "Invited by",
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.commission_percentage,
        Cell: ({ cell }) => <span>{parseFloat(cell.getValue() as string)?.toFixed(2)}%</span>,
        header: "Commission",
        id: "commission_percentage",
        editVariant: "text",
        mantineTableHeadCellProps: {
          sx: {
            "& > div:first-of-type": {
              justifyContent: "center !important",
            },
          },
        },
        mantineTableBodyCellProps: {
          sx: {
            textAlign: "center",
          },
        },
        mantineEditTextInputProps: {
          h: 32,
          type: "number",
          styles: {
            root: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            },
            wrapper: {
              width: rem(100),
            },
            input: {
              minHeight: rem(32),
              height: rem(32),
              backgroundColor: "#25262B",
              "&:not([data-invalid]):focus": {
                borderColor: "#3077F3",
              },
            },
            error: {
              textAlign: "left",
            },
          },
          step: 0.01,
          min: 6,
          max: 100,
          required: true,
          placeholder: "",
          error: Boolean(validationErrors?.commission),
          rightSection: "%",
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            if (!e.target.value || parseFloat(e.target.value) < 6) {
              setValidationErrors({
                ...validationErrors,
                commission: "Commission Percentage should not be less than 6%",
              });
            } else {
              setValidationErrors({
                ...validationErrors,
                commission: undefined,
              });
            }
          },
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              commission: undefined,
            }),
        },
      },
      {
        accessorFn: (row) =>
          getStatus({
            status: row.owner?.status as string,
            date: row.owner?.invitation_sent_at as string,
            resendInvite: () => onResendInvite(row.id),
          }),
        header: "Status",
        id: "organization_status",
        enableEditing: false,
      },
    ],
    [validationErrors, addedItem]
  );

  const handleSaveUser: MRT_TableOptions<IOrganizationListItem>["onEditingRowSave"] = async ({
    row,
    values,
    table,
  }) => {
    let isValid = true;
    Object.keys(validationErrors).forEach((element) => {
      if (validationErrors[element]) {
        errorNotification({
          message: validationErrors[element],
        });
        isValid = false;
      }
    });
    if (!isValid) {
      return;
    }
    // Passing the organization object for future iterations (if we need to edit other properties)
    await updateOrganization({
      ...row.original,
      commission_percentage: values.commission_percentage,
    });
    table.setEditingRow(null);
  };

  const table = useMantineReactTable({
    columns,
    data: resultData,
    paginationDisplayMode: "pages",
    editDisplayMode: "row",
    enableEditing: true,
    onEditingRowSave: handleSaveUser,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Action",
      },
    },
    state: {
      isLoading: isLoadingOrganizations,
      isSaving: isUpdatingOrganization,
      showAlertBanner: isLoadingOrganizationsError,
      showProgressBars: isFetchingOrganizations,
    },
    mantinePaperProps: {
      sx: {
        position: "relative",
        zIndex: 0,
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
      },
    }),
    mantineToolbarAlertBannerProps: {
      sx: {
        display: "none",
      },
    },
    onEditingRowCancel: () => setValidationErrors({}),
    renderRowActions: ({ row, table }) => (
      <Tooltip label="Edit">
        <ActionIcon onClick={() => table.setEditingRow(row)}>
          <PencilIcon />
        </ActionIcon>
      </Tooltip>
    ),
    mantineTopToolbarProps: {
      sx: {
        "& > div:nth-of-type(2)": {
          display: "flex",
          alignItems: "center",
          paddingRight: 20,
        },
      },
    },
    mantineTableBodyCellProps: {
      sx: {
        "& div:first-of-type button:first-of-type": {
          color: "#FF6666CC",
        },
        "& div:first-of-type button:last-of-type": {
          color: "#09A778",
        },
      },
    },
    mantineBottomToolbarProps: {
      sx: {
        "& > div:last-of-type ": {
          justifyContent: "center",
          "& > div": {
            right: "auto",
            "@media (max-width: 40em)": {
              width: "100%",
              "& > div": {
                width: "100%",
                flexDirection: "column",
              },
            },
          },
        },
      },
    },
    renderTopToolbarCustomActions: () => (
      <Button
        variant="gradient"
        gradient={{ from: "#3077F3", to: "#15AABF" }}
        fw={400}
        onClick={openAddModal}
        m={rem(20)}
        styles={{
          root: {
            height: rem(34),
          },
        }}
        leftIcon={<IconPlus />}
      >
        Invite Organization
      </Button>
    ),
  });

  return <MantineReactTable table={table} />;
};
