import { inviteOrganization, resendInviteOrganization } from "@/api/handler/admin";
import NoSsr from "@/common/NoSsr";
import withAuth from "@/common/withAuth";
import { useBreakpoint } from "@/hooks";
import { OrganizationList } from "@/modules/admin/OrganizationList";
import { InviteOrganizationModal } from "@/modules/organization/InviteOrganizationModal";
import { CustomErrorResponse } from "@/types";
import { errorNotification, organizationListKey, successNotification } from "@/utils";
import { Box, Container, Flex, Title, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function AdminDashboard() {
  const queryClient = useQueryClient();

  const { isMobile } = useBreakpoint();

  const [opened, { open, close }] = useDisclosure(false);

  const [addedOrganizationId, setAddedOrganizationId] = useState<string | null>(null);

  const { mutate: handleInvite, isLoading: inviteLoading } = useMutation(
    ({ email, commission_percentage }: { email: string; commission_percentage: number }) =>
      inviteOrganization({ email, commission_percentage }).then((res) => res.data),
    {
      onSuccess: (invitedOrganization) => {
        setAddedOrganizationId(invitedOrganization.id);

        queryClient.invalidateQueries({ queryKey: [organizationListKey] });
        // Show success notification
        successNotification({
          title: "Success!",
          message: `Organization added.`,
        });
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );

  const { mutate: handleResendInvite } = useMutation(
    (organizationId: string) => resendInviteOrganization(organizationId).then((res) => res),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [organizationListKey] });
        // Show success notification
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

  return (
    <NoSsr>
      <OrganizerDashboardLayout hasFooter={false}>
        <NovelTHead title="Dashboard" />
        <Container maw={rem(1920)} my={rem(24)} mx={isMobile ? rem(16) : rem(50)}>
          <Flex justify="space-between" direction={isMobile ? "column" : "row"}>
            <Title order={1} size="h2" fz={rem(24)} fw={500} color="#FFFFFFCC">
              Dashboard
            </Title>
          </Flex>
        </Container>
        <Container
          size={!isMobile ? rem(1920) : "xs"}
          mt={rem(36)}
          mx={isMobile ? rem(16) : rem(50)}
          mb={isMobile ? rem(42) : undefined}
        >
          <Box sx={{ overflow: "auto" }} mr={-30} mb={isMobile ? rem(36) : rem(60)}>
            <OrganizationList
              onResendInvite={handleResendInvite}
              addedOrganizationId={addedOrganizationId}
              openAddModal={open}
            />
          </Box>
        </Container>
        <InviteOrganizationModal
          opened={opened}
          onClose={close}
          onModalSubmit={handleInvite}
          submitLoading={inviteLoading}
        />
      </OrganizerDashboardLayout>
    </NoSsr>
  );
}

export default withAuth(AdminDashboard);
