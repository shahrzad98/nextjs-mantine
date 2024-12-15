import { useBreakpoint } from "@/hooks";
import checkoutStore from "@/stores/cartStore";
import { ICheckoutStore } from "@/types";
import { ITicketTierResponse } from "@/types/ticket";
import { getEventDateTimeInfo, separateByThousands, warningNotification } from "@/utils";
import { Button, Container, Flex, Grid, Text, Tooltip, rem, Box } from "@mantine/core";
import { IconArrowLeft, IconExclamationCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";

import { NovelTHead, NVTLayout, TicketCard } from "@/components";
import Breadcrumbs from "@/components/OrganizerDashboardLayout/Navbar/Breadcrumbs";

export function CheckoutModule({ children }: PropsWithChildren) {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const router = useRouter();
  const { isMobile, isTablet } = useBreakpoint();

  const [timer, setTimer] = useState<number>(-1);
  const checkoutData = checkoutStore((state: ICheckoutStore) => state.checkout);
  const emptyCheckout = checkoutStore((state: ICheckoutStore) => state.emptyCheckout);

  const currentCart = checkoutData?.cart;
  const currentEvent = checkoutData?.event;
  const currentPurchase = checkoutData?.purchase;
  const currentTier = checkoutData?.event?.ticket_tiers.find(
    (item: ITicketTierResponse) => item.id === currentCart?.ticket_tier_id
  );

  const handleBack = () => {
    router.push(`/event/${currentEvent?.slug}`);
  };

  useEffect(() => {
    if (timer === 0) {
      emptyCheckout();
      router.push(`/event/${currentEvent?.slug}`);
      warningNotification({
        message:
          "Unfortunately, you have run out of time to hold that ticket. Please select the ticket you would like to purchase again.",
      });
    } else if (timer === -1) {
      const secondsInTheFuture = new Date(currentCart?.expires_at as string).getTime() / 1000;
      const secondsNow = new Date().getTime() / 1000;
      const difference = Math.round(secondsInTheFuture - secondsNow);
      if (difference < 0) {
        setTimer(0);
      } else {
        setTimer(difference);
      }
    } else {
      const countdown = timer >= 0 ? setInterval(() => setTimer(timer - 1), 1000) : undefined;

      return () => clearInterval(countdown);
    }
  }, [timer]);

  const getRemaining = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().substr(14, 5);

    return timeString;
  };

  const { date, weekday, startTime, endTime } = getEventDateTimeInfo(
    currentTier?.start_at || "",
    currentTier?.end_at || "",
    currentEvent?.time_zone?.utc_offset
  );

  const LayoutChildren = (
    <Grid.Col
      span={12}
      mb={isMobile ? rem(54) : undefined}
      md={6}
      offset={!isTablet ? 2 : 0}
      px={isMobile ? rem(20) : undefined}
    >
      <Flex justify={"center"}>
        <Flex w={isMobile ? "100%" : rem(360)} direction={isMobile ? "column" : undefined}>
          {children}
        </Flex>
      </Flex>
    </Grid.Col>
  );

  const showChildrenOnTop = isMobile && router.pathname === "/checkout/auth/email-verification";

  return (
    <NVTLayout
      navbarProps={{
        background: "none",
        currentPageTitle: "Buy Tickets",
        emailConfirmationBanner: "myAccount",
        handleBackButton: () => router.push(`/event/${currentEvent?.slug}`),
      }}
      backgroundGradientVariant={9}
    >
      <NovelTHead title="Checkout" />
      <Flex
        w={!isTablet ? "80%" : "100%"}
        pr={!isTablet ? 0 : 16}
        maw={rem(1920)}
        mx={"auto"}
        justify={!isTablet ? "space-between" : "flex-end"}
        mb={rem(!isTablet ? 72 : 22)}
      >
        {!isTablet && (
          <Button
            leftIcon={<IconArrowLeft color="#fff" />}
            size="md"
            h="auto"
            p={0}
            onClick={handleBack}
            variant="subtle"
            styles={{
              leftIcon: {
                marginRight: rem(16),
              },
              label: {
                fontSize: rem(24),
                color: "#fff",
              },
            }}
          >
            Buy Tickets
          </Button>
        )}
        <Flex direction={"column"} align={"flex-end"}>
          {!isTablet && (
            <Breadcrumbs
              items={[
                {
                  title: "Home",
                  href: "/",
                },
                {
                  title: "Events",
                  href: "/events/search?page=1&per_page=12",
                },
                {
                  title: currentEvent?.name || "",
                  href: `/event/${currentEvent?.slug}`,
                },
                {
                  title: "Buy Tickets",
                  href: "/checkout",
                },
              ]}
            />
          )}
          <Flex align={"center"} mt={rem(!isTablet ? 16 : 12)} sx={{ zIndex: 9 }}>
            <Text mr={rem(10)} size={rem(18)} fw={"400"} color="#3077F3">
              {getRemaining(timer)}
            </Text>
            <Box>
              <Tooltip
                multiline
                width={207}
                label="The clock is ticking! This timer shows how long we will hold these tickets during checkout. Once the timer expires, the tickets will be released and other customers will have a chance to purchase them. However, you can still buy these tickets later, if they're still available."
                styles={{
                  tooltip: {
                    backgroundColor: "#282B3D",
                    color: "#fff",
                    padding: rem(12),
                  },
                }}
                transitionProps={{ transition: "pop-bottom-right" }}
                events={{ hover: true, focus: true, touch: true }}
              >
                <IconExclamationCircle
                  size={rem(24)}
                  style={{
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Container size={!isTablet ? rem(1042) : "xs"}>
        <Grid>
          {showChildrenOnTop && LayoutChildren}
          <Grid.Col span={12} md={4} mb={isMobile && showChildrenOnTop ? rem(72) : undefined}>
            <Flex direction={"column"} align={"center"} w={"100%"} mb={rem(!isTablet ? 72 : 0)}>
              <TicketCard
                date={`${weekday}, ${date}`}
                time={`${startTime} - ${endTime} ${currentEvent?.time_zone.abbr}`}
                location={`${currentEvent?.address}, ${currentEvent?.city}, ${currentEvent?.province_state}, ${currentEvent?.country}`}
                tier={currentTier?.name || ""}
                cadPrice={currentTier?.price}
                title={currentEvent?.name || ""}
                thumbnail={currentEvent?.primary_image as string}
                currency={process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"}
                admission={currentTier?.name?.toUpperCase() || ""}
                seats={currentTier?.seats as number}
                quantity={currentPurchase?.quantity as number}
                type="original"
              />
              <Text size={rem(36)} lh={rem(44)} fw={"500"} mt={rem(36)}>
                ${" "}
                {separateByThousands(
                  ((currentTier?.price as number) * (currentCart?.quantity as number)).toFixed(2)
                )}
                <Text span size={rem(12)} ml={4} sx={{ verticalAlign: "middle" }}>
                  {process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"}
                </Text>
              </Text>
            </Flex>
          </Grid.Col>
          {!showChildrenOnTop && LayoutChildren}
        </Grid>
      </Container>
    </NVTLayout>
  );
}
