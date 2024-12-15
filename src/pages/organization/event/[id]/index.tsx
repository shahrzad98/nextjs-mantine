import { getAttendeeList, getEvent } from "@/api/handler";
import withAuth from "@/common/withAuth";
import { useBreakpoint } from "@/hooks";
import { EventDraftModule, EventPublishModule, StripeSetupModal } from "@/modules";
import userStore from "@/stores/userStore";
import { IEventAttendee } from "@/types";
import { isHttpError } from "@/types/http";
import { errorNotification } from "@/utils";
import { attendeeListKey, eventKey } from "@/utils/queryKeys";
import { ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { BackgroundGradients, NovelTHead, OrganizerDashboardLayout } from "@/components";

const Event = () => {
  const {
    query: { id },
    isReady,
  } = useRouter();
  const queryClient = useQueryClient();

  const { isMobile, isDesktop } = useBreakpoint();

  const [stripeSetupOpened, { open: openStripeSetup }] = useDisclosure(false);

  const currentUser = userStore((state) => state.currentUser);
  const stripeIsActive = currentUser?.data?.organization?.active;

  useEffect(() => {
    if (!!currentUser && !stripeIsActive) {
      openStripeSetup();
    }
  }, [currentUser, openStripeSetup, stripeIsActive]);

  const {
    data: eventData,
    isSuccess,
    refetch,
    error,
  } = useQuery([eventKey(id as string)], () => getEvent(id as string).then((res) => res.data), {
    enabled: isReady,
    initialData: queryClient.getQueryData([eventKey(id as string)]),
  });

  const { data: attendeeListData, isSuccess: isAttendeeListSuccess } = useQuery(
    [eventKey(id as string), attendeeListKey],
    () => getAttendeeList(id as string, 1, 10000).then((res) => res.data),
    {
      enabled: isReady,
      initialData: queryClient.getQueryData([eventKey(id as string), attendeeListKey]),
    }
  );

  useEffect(() => {
    isHttpError(error) && errorNotification(error);
  }, [error]);

  return (
    <OrganizerDashboardLayout
      hasFooter={false}
      navbarProps={{
        background: "none",
        currentPageTitle: "Summary",
        rightSideActions: eventData?.status !== "done" && eventData?.status !== "canceled" && (
          <Link href={`/organization/event/${eventData?.id}/preview`}>
            <ActionIcon sx={(theme) => ({ svg: { color: theme.colors.indigo[4] } })}>
              <IconEye />
            </ActionIcon>
          </Link>
        ),
      }}
    >
      <NovelTHead title={eventData?.name as string} />
      {isSuccess && (
        <>
          {eventData.status === "draft" ? (
            <EventDraftModule eventData={eventData} refetch={refetch} />
          ) : (
            !(!isAttendeeListSuccess && eventData.status === "published") && (
              <EventPublishModule
                eventData={eventData}
                attendeeData={attendeeListData as IEventAttendee[]}
              />
            )
          )}
        </>
      )}
      <StripeSetupModal opened={stripeSetupOpened} />

      <BackgroundGradients
        variant={7}
        h={isDesktop ? "200vh" : undefined}
        top={!isMobile ? -350 : 0}
        right={isMobile ? 0 : undefined}
        sx={{
          transform: !isMobile ? "translateY(350px)" : undefined,
          zIndex: -1,
          overflow: "hidden",
        }}
      />
    </OrganizerDashboardLayout>
  );
};

export default withAuth(Event);
