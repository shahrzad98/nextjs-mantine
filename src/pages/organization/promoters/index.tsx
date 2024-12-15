import withAuth from "@/common/withAuth";
import { useBreakpoint } from "@/hooks";
import { OrganizationPromoterList } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { Box, Flex, rem } from "@mantine/core";
import { Container } from "@mantine/core";
import { Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

function OrganizationPromoters() {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser?.role !== UserType.Organizer) {
      router.push("/");
    } else {
      setMounted(true);
    }
  }, [router.isReady, setMounted]);

  return router.isReady && mounted ? (
    <OrganizerDashboardLayout hasFooter={false} navbarProps={{ currentPageTitle: "Promoters" }}>
      <NovelTHead title="Promoters" />
      <Container maw={rem(1920)} my={rem(24)} mx={isMobile ? rem(16) : rem(50)}>
        <Flex justify="space-between" direction={isMobile ? "column" : "row"}>
          <Title order={1} size="h2" fz={rem(24)} fw={500} color="#FFFFFFCC">
            Promoters
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
          <OrganizationPromoterList />
        </Box>
      </Container>
    </OrganizerDashboardLayout>
  ) : (
    <></>
  );
}

export default withAuth(OrganizationPromoters);
