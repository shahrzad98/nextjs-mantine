import { getMyEvents } from "@/api/handler";
import withAuth from "@/common/withAuth";
import { useBreakpoint } from "@/hooks";
import { TicketInsight, TicketsSoldActive, AllTicketsSold, TopEventsSold } from "@/modules";
import userStore from "@/stores/userStore";
import { IOrganizationUser, IUserStore } from "@/types";
import { myEventsKey } from "@/utils";
import { Box, Flex, Title, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React, { FC } from "react";

import { NovelTHead, OrganizerDashboardLayout } from "@/components";

const OrganizerDashboard: FC = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const user = currentUser?.data as IOrganizationUser;

  const { data: events } = useQuery({
    queryKey: [myEventsKey],
    queryFn: ({ pageParam = 1 }) =>
      getMyEvents({
        page: pageParam,
        perPage: 9,
      }),
  });

  return (
    <OrganizerDashboardLayout hasFooter={false}>
      <NovelTHead title="Dashboard" />
      {events?.meta?.total_count === 0 ? (
        <>
          {!isTablet && (
            <Text size={24} mt={20} ml={100} mb={70}>
              Dashboard
            </Text>
          )}
          <Box px={30} ml={isTablet ? 0 : 100} maw={695} mt={isTablet ? 30 : 0}>
            <Title
              order={isTablet ? 2 : 1}
              color="grape.3"
              mb={isTablet ? 18 : 45}
              sx={{
                background: "linear-gradient(45deg,#3077F3 0%, #15AABF 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome, {user?.organization?.name}!
            </Title>
            <Text>
              Once you create events, you will see statistics from their activity displayed here.
              From this page you can review your sales and across all events you have created.
            </Text>
          </Box>
        </>
      ) : (
        <Box maw={959} my={isMobile ? 0 : 55} mx="auto" px={!isTablet && !isDesktop ? 40 : 0}>
          <Flex
            justify="start"
            align={isMobile ? "center" : "unset"}
            direction={isMobile ? "column" : "row"}
          >
            <TopEventsSold />
            <TicketInsight />
          </Flex>
          <AllTicketsSold />
          <TicketsSoldActive />
        </Box>
      )}
    </OrganizerDashboardLayout>
  );
};

export default withAuth(OrganizerDashboard);
