import NoSsr from "@/common/NoSsr";
import withAuth from "@/common/withAuth";
import { useBreakpoint } from "@/hooks";
import { TopPurchases } from "@/modules";
import { Invitations } from "@/modules/promoter/dashboard/Invitations";
import { Container, Flex, Title, rem } from "@mantine/core";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function PromoterDashboard() {
  const { isMobile } = useBreakpoint();

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
          <Invitations />
          <TopPurchases />
        </Container>
      </OrganizerDashboardLayout>
    </NoSsr>
  );
}

export default withAuth(PromoterDashboard);
