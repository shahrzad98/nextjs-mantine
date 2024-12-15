import { deleteTeamMember, getTeamMembers, inviteTeamMember } from "@/api/handler/organization";
import NoSsr from "@/common/NoSsr";
import withAuth from "@/common/withAuth";
import { useBreakpoint } from "@/hooks";
import { InviteUserModal, TeamMemberList } from "@/modules";
import { CustomAxiosResponse, CustomErrorResponse, isHttpError } from "@/types";
import {
  IOrganizationAdmin,
  IOrganizationOperator,
  IOrganizationOwner,
  IOrganizationTeamMemberRequest,
} from "@/types/organization";
import { errorNotification, successNotification } from "@/utils";
import { teamMembersKey } from "@/utils/queryKeys";
import { Box, Button, Container, Flex, Title, rem, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function TeamManagement() {
  const { isMobile, isTablet } = useBreakpoint();

  const [opened, { open, close }] = useDisclosure(false);

  const [addedMemberId, setAddedMemberId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, error, isSuccess } = useQuery(
    [teamMembersKey],
    () => getTeamMembers().then((res) => res.data),
    {
      initialData: queryClient.getQueryData([teamMembersKey]),
    }
  );

  const PER_PAGE = 6;
  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error as AxiosError);
    }
  }, [error]);

  const { mutate: handleInvite, isLoading: inviteLoading } = useMutation(
    (teamMember: IOrganizationTeamMemberRequest) =>
      inviteTeamMember(teamMember).then((res) => res.data),
    {
      onSuccess: (invitedMember) => {
        // Add the invited member to the table
        const previousData = queryClient.getQueryData<
          CustomAxiosResponse<
            (IOrganizationAdmin | IOrganizationOwner | IOrganizationOperator)[]
          >["data"]
        >([teamMembersKey]);
        const newData = [
          invitedMember,
          ...(previousData as CustomAxiosResponse<
            (IOrganizationAdmin | IOrganizationOwner | IOrganizationOperator)[]
          >["data"]),
        ];
        queryClient.setQueryData([teamMembersKey], newData);

        // Set the invited member id
        setAddedMemberId(invitedMember.id);

        setTimeout(() => {
          setAddedMemberId(null);
        }, 5000);

        // Show success notification
        successNotification({
          title: "Successful",
          message: `${invitedMember.first_name} ${invitedMember.last_name} Successfully Invited.`,
        });
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );

  const { mutate: handleDelete } = useMutation(
    (teamMemberId: string) => deleteTeamMember(teamMemberId).then((res) => res),
    {
      onSuccess: (res, teamMemberId) => {
        // Remove member from the table
        const previousData = queryClient.getQueryData<
          CustomAxiosResponse<
            (IOrganizationAdmin | IOrganizationOwner | IOrganizationOperator)[]
          >["data"]
        >([teamMembersKey]);
        const newData = [
          ...(previousData as CustomAxiosResponse<
            (IOrganizationAdmin | IOrganizationOwner | IOrganizationOperator)[]
          >["data"]),
        ].filter((member) => member.id !== teamMemberId);
        queryClient.setQueryData([teamMembersKey], newData);

        // Show success notification
        successNotification({
          title: "Successful",
          message: "User Successfully Deleted.",
        });
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );

  return (
    <NoSsr>
      <OrganizerDashboardLayout
        hasFooter={false}
        navbarProps={{ currentPageTitle: "Team Management" }}
      >
        <NovelTHead title="Team Management" />
        <Container maw={rem(1289)} my={rem(24)} px={isMobile ? rem(27) : undefined}>
          <Flex justify="space-between">
            {!isTablet && (
              <Title order={1} size="h2" fw={500} color="#FFFFFFCC">
                Team Management
              </Title>
            )}
            <Button
              variant="gradient"
              gradient={{ from: "#3077F3", to: "#15AABF" }}
              fw={400}
              fullWidth={isTablet}
              mt={isTablet ? rem(48) : undefined}
              onClick={open}
              styles={{
                root: {
                  height: rem(44),
                },
              }}
            >
              Invite Users
            </Button>
          </Flex>
        </Container>
        <Container
          size={!isMobile ? rem(1042) : "xs"}
          mt={isMobile ? rem(67) : rem(80)}
          px={isMobile ? rem(27) : undefined}
        >
          <Box sx={{ overflow: "auto" }} mr={-30}>
            {isSuccess && (
              <TeamMemberList
                members={data.slice((page - 1) * PER_PAGE, page * PER_PAGE)}
                onDelete={handleDelete}
                addedMemberId={addedMemberId}
              />
            )}
          </Box>
          {data && data.length > PER_PAGE && (
            <Pagination
              value={page}
              onChange={setPage}
              total={Math.ceil(data.length / PER_PAGE)}
              size="sm"
              position="center"
              mb={20}
              mt={50}
            />
          )}
        </Container>
        <InviteUserModal
          opened={opened}
          onClose={close}
          onModalSubmit={handleInvite}
          submitLoading={inviteLoading}
        />
      </OrganizerDashboardLayout>
    </NoSsr>
  );
}

export default withAuth(TeamManagement);
