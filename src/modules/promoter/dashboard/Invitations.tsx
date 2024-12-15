import { useBreakpoint } from "@/hooks";
import { Card, Flex, rem, Text } from "@mantine/core";
import React from "react";

import { GradientTitle } from "@/components";

import { InvitationList } from "./InvitationList";

export const Invitations = () => {
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <Card my={isMobile ? undefined : "xl"} mx={isTablet ? 20 : undefined} pb={rem(19)} withBorder>
      <Card.Section pt={isMobile ? 20 : 36} pb={rem(20)} px={30}>
        <Flex direction={"column"} mb={isMobile ? 25 : 0}>
          <div>
            {!isMobile && (
              <GradientTitle weight={500} size={rem(30)}>
                Invitations
              </GradientTitle>
            )}
            <Text size="sm" align="left" mb={isMobile ? "lg" : undefined}>
              Latest invitations you’ve received from novelT’s event organizers
            </Text>
          </div>
          <InvitationList />
        </Flex>
      </Card.Section>
    </Card>
  );
};
