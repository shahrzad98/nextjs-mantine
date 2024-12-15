import { getPromoterEventDetails } from "@/api/handler";
import withAuth from "@/common/withAuth";
import { useBreakpoint } from "@/hooks";
import { EventPromoterChart } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { promoterEventStatsKey } from "@/utils";
import { Box, Card, Divider, Flex, rem } from "@mantine/core";
import { Container } from "@mantine/core";
import { Title } from "@mantine/core";
import { Text } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { GradientTitle, NovelTHead, OrganizerDashboardLayout } from "@/components";

function useGetEventData(values: { eventId: string; mounted: boolean }) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [promoterEventStatsKey],
    enabled: values.mounted,
    queryFn: async () => getPromoterEventDetails(values).then((res) => res.data),
    initialData: queryClient.getQueryData([promoterEventStatsKey]),
  });
}

function OrganizationPromoterDetails() {
  const router = useRouter();
  const { id: eventId } = router.query;

  const { isMobile } = useBreakpoint();
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const [mounted, setMounted] = useState<boolean>(false);

  const { data: promoterEventData, isSuccess: isLoadingPromoterEventSuccess } = useGetEventData({
    eventId: eventId as string,
    mounted,
  });

  useEffect(() => {
    if (currentUser?.role !== UserType.Promoter) {
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
            {promoterEventData?.event_name}
          </Title>
        </Flex>
      </Container>
      <Container
        size={!isMobile ? rem(1920) : "xs"}
        mt={rem(36)}
        mx={isMobile ? rem(16) : rem(50)}
        mb={isMobile ? rem(42) : undefined}
      >
        <Box sx={{ overflow: "auto" }} mr={isMobile ? -30 : 0} mb={isMobile ? rem(36) : rem(60)}>
          <Card withBorder px={rem(36)} py={rem(14)}>
            <Flex align={"center"} gap={rem(30)}>
              <Flex direction={"column"} w={"50%"} py={rem(16)}>
                <GradientTitle fz={rem(30)}>
                  {promoterEventData?.commission_type === "amount" ? "$" : ""}
                  {promoterEventData?.commission_amount}
                  {promoterEventData?.commission_type === "percentage" ? "%" : ""}
                </GradientTitle>
                <Text c={"#FFFFFFB2"} fw={500}>
                  Commission
                </Text>
              </Flex>
              <Divider orientation="vertical" />
              <Flex direction={"column"} w={"50%"} py={rem(16)}>
                <GradientTitle fz={rem(30)}>${promoterEventData?.total_revenue}</GradientTitle>
                <Text c={"#FFFFFFB2"} fw={500}>
                  Total Revenue
                </Text>
              </Flex>
            </Flex>
          </Card>
          {isLoadingPromoterEventSuccess && (
            <EventPromoterChart
              chart_data={promoterEventData?.purchases || {}}
              description="Ticket purchases with your promotion link"
              title="Purchases"
              total_count={promoterEventData.purchases_count}
              total_name={"Purchases"}
            />
          )}

          {isLoadingPromoterEventSuccess && (
            <EventPromoterChart
              chart_data={promoterEventData?.views || {}}
              description="Event views with your promotion link"
              title="Views"
              total_count={promoterEventData.views_count}
              total_name={"Views"}
            />
          )}
        </Box>
      </Container>
    </OrganizerDashboardLayout>
  ) : (
    <></>
  );
}

export default withAuth(OrganizationPromoterDetails);
