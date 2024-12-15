import { useBreakpoint } from "@/hooks";
import checkoutStore from "@/stores/cartStore";
import userStore from "@/stores/userStore";
import { CheckoutResponse, ICheckoutStore, IUserStore } from "@/types";
import { ITicketTierResponse } from "@/types/ticket";
import { getEventDateTimeInfo, separateByThousands, warningNotification } from "@/utils";
import {
  Anchor,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Flex,
  Grid,
  Overlay,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconExclamationCircle,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NovelTHead, NVTLayout, TicketCard } from "@/components";
import Breadcrumbs from "@/components/OrganizerDashboardLayout/Navbar/Breadcrumbs";

import { CheckoutForm } from "./checkout-form";
import { PaymentDetails } from "./PaymentDetails";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export function CheckoutPayModule() {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const router = useRouter();
  const { isTablet } = useBreakpoint();

  const [timer, setTimer] = useState<number>(-1);

  const [opened, { toggle }] = useDisclosure(false);
  const [openedMobile, { toggle: toggleMobile }] = useDisclosure(false);

  const [paymentInfo, setPaymentInfo] = useState<CheckoutResponse | null>(null);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);

  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const checkoutData = checkoutStore((state: ICheckoutStore) => state.checkout);
  const emptyCheckout = checkoutStore((state: ICheckoutStore) => state.emptyCheckout);

  const currentCart = checkoutData?.cart;
  const currentEvent = checkoutData?.event;
  const currentPurchase = checkoutData?.purchase;
  const currentPayment = checkoutData?.payment_intent;
  const currentTier = checkoutData?.event?.ticket_tiers.find(
    (item: ITicketTierResponse) => item.id === currentCart?.ticket_tier_id
  );

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
      setTimer(difference);
    } else {
      const countdown = timer > 0 ? setInterval(() => setTimer(timer - 1), 1000) : undefined;

      return () => clearInterval(countdown);
    }
  }, [timer]);

  const getRemaining = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().substr(14, 5);

    return timeString;
  };

  const handleBack = () => {
    router.push(`/event/${currentEvent?.slug}`);
  };

  const options = {
    // passing the client secret obtained from the server
    appearance: {
      theme: "stripe",
      rules: {
        ".Label": {
          color: "#697386",
        },
      },
    },
    clientSecret: currentPayment?.client_secret,
  };

  const { date, weekday, startTime, endTime } = getEventDateTimeInfo(
    currentTier?.start_at || "",
    currentTier?.end_at || "",
    currentEvent?.time_zone?.utc_offset
  );

  const amount =
    paymentInfo?.purchase?.total_amount || (currentPayment?.amount as number) / 100 || 0;

  const hasConversion =
    (process.env.NEXT_PUBLIC_REGION === "US" && currentCountry === "CA") ||
    (process.env.NEXT_PUBLIC_REGION === "CA" && currentCountry === "US");

  const currency =
    currentCountry === "US"
      ? "USD"
      : currentCountry === "CA"
      ? "CAD"
      : process.env.NEXT_PUBLIC_REGION === "US"
      ? "USD"
      : "CAD";

  return (
    <NVTLayout
      navbarProps={{
        background: "none",
        currentPageTitle: "Buy Tickets",
        handleBackButton: () => router.push(`/event/${currentEvent?.slug}`),
      }}
      backgroundGradientVariant={9}
    >
      <NovelTHead title="Checkout | Pay" />

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
          <Flex align={"center"} mt={rem(!isTablet ? 16 : 12)}>
            <Text mr={rem(10)} size={rem(18)} fw={"400"} color="#3077F3">
              {getRemaining(timer)}
            </Text>
            <Box sx={{ zIndex: 9 }}>
              <Tooltip
                multiline
                w={rem(207)}
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
        {isTablet && (
          <>
            <Divider />
            {openedMobile && (
              <Overlay color="#000" opacity={0.86} top={63}>
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                  sx={(theme) => ({
                    background: theme.colors.dark[6],
                  })}
                  pb={18}
                >
                  <Container size="xs" w="100%">
                    <Flex w="100%" justify="flex-end">
                      <Button
                        my={12}
                        variant="subtle"
                        color="dark"
                        size="xs"
                        fw={500}
                        rightIcon={<IconChevronUp size={16} />}
                        onClick={toggleMobile}
                      >
                        Close
                      </Button>
                    </Flex>
                    <Collapse
                      in={openedMobile}
                      display="flex"
                      sx={{ flexDirection: "column", alignItems: "center" }}
                    >
                      <PaymentDetails
                        amount={
                          paymentInfo?.purchase?.total_amount ||
                          (currentPayment?.amount as number) / 100 ||
                          0
                        }
                        fees={paymentInfo?.purchase?.fees || currentPurchase?.fees || 0}
                        conversionFee={paymentInfo?.purchase?.convertion_fee || 0}
                        taxAmount={paymentInfo?.purchase?.tax_amount || 0}
                        taxPercentage={paymentInfo?.purchase?.tax_percentage || 0}
                        subtotal={paymentInfo?.purchase?.subtotal || currentPurchase?.subtotal || 0}
                        quantity={paymentInfo?.purchase?.quantity || currentPurchase?.quantity || 0}
                        hasTax={
                          (process.env.NEXT_PUBLIC_REGION === "US" && currentCountry === "US") ||
                          (process.env.NEXT_PUBLIC_REGION === "CA" && currentCountry === "CA")
                        }
                        hasConversion={
                          (process.env.NEXT_PUBLIC_REGION === "US" && currentCountry === "CA") ||
                          (process.env.NEXT_PUBLIC_REGION === "CA" && currentCountry === "US")
                        }
                        rate={paymentInfo?.exchange_rate || 1}
                      />
                    </Collapse>
                  </Container>
                </Flex>
              </Overlay>
            )}
            <Flex w="100%" justify="flex-end">
              <Button
                my={12}
                variant="subtle"
                color="dark"
                size="xs"
                fw={500}
                rightIcon={<IconChevronDown size={16} />}
                onClick={toggleMobile}
              >
                Details
              </Button>
            </Flex>
          </>
        )}
        <Grid>
          <Grid.Col span={12} md={4}>
            <Flex direction={"column"} align={"center"} w={"100%"} mb={!isTablet ? rem(72) : 0}>
              <TicketCard
                date={`${weekday}, ${date}`}
                time={`${startTime} - ${endTime} ${currentEvent?.time_zone.abbr}`}
                location={`${currentEvent?.address}, ${currentEvent?.city}, ${currentEvent?.province_state}, ${currentEvent?.country}`}
                tier={currentTier?.name}
                cadPrice={
                  hasConversion && paymentInfo?.exchange_rate
                    ? (currentTier?.price as number) / paymentInfo?.exchange_rate
                    : currentTier?.price
                }
                title={currentEvent?.name || ""}
                thumbnail={currentEvent?.primary_image as string}
                currency={currency as "USD" | "CAD"}
                admission={currentTier?.name?.toUpperCase() ?? ""}
                quantity={currentPurchase?.quantity as number}
                seats={currentTier?.seats as number}
                type="original"
              />
              <Text size={rem(36)} lh={rem(44)} fw={"500"} mt={rem(30)} mb={rem(14)} c="white">
                ${" "}
                {separateByThousands(
                  (hasConversion ? amount / (paymentInfo?.exchange_rate || 1) : amount).toFixed(2)
                )}
                <Text
                  span
                  size={rem(12)}
                  ml={4}
                  sx={{ verticalAlign: "middle" }}
                  c="rgba(255, 255, 255, 0.80)"
                >
                  {currency}
                </Text>
              </Text>
              {!isTablet && (
                <>
                  <Anchor
                    mt={rem(16)}
                    fz={rem(12)}
                    fw={500}
                    sx={{
                      display: "flex",
                      gap: rem(15),
                      alignItems: "center",
                      textDecoration: "underline",
                    }}
                    c="rgba(255, 255, 255, 0.80)"
                    onClick={toggle}
                  >
                    {opened ? "Close" : "Details"}{" "}
                    {opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </Anchor>
                  <Collapse in={opened}>
                    <PaymentDetails
                      amount={amount}
                      fees={paymentInfo?.purchase?.fees || currentPurchase?.fees || 0}
                      conversionFee={paymentInfo?.purchase?.convertion_fee || 0}
                      taxAmount={paymentInfo?.purchase?.tax_amount || 0}
                      taxPercentage={paymentInfo?.purchase?.tax_percentage || 0}
                      subtotal={paymentInfo?.purchase?.subtotal || currentPurchase?.subtotal || 0}
                      quantity={paymentInfo?.purchase?.quantity || currentPurchase?.quantity || 0}
                      hasTax={
                        (process.env.NEXT_PUBLIC_REGION === "US" && currentCountry === "US") ||
                        (process.env.NEXT_PUBLIC_REGION === "CA" && currentCountry === "CA")
                      }
                      hasConversion={
                        (process.env.NEXT_PUBLIC_REGION === "US" && currentCountry === "CA") ||
                        (process.env.NEXT_PUBLIC_REGION === "CA" && currentCountry === "US")
                      }
                      rate={paymentInfo?.exchange_rate || 1}
                    />
                  </Collapse>
                </>
              )}
            </Flex>
          </Grid.Col>
          <Grid.Col span={12} md={6} offset={!isTablet ? 2 : 0}>
            <Divider label="Pay with card" labelPosition="center" />

            <Box w={"100%"} sx={{ borderRadius: rem(6) }} bg={"#25262B"} p={rem(13)} mt={rem(32)}>
              <Text size={rem(16)} fw={"400"} lh={rem(22)}>
                Email
                <Text span ml={rem(28)}>
                  {currentUser?.data?.email}
                </Text>
              </Text>
            </Box>

            <Text
              size={rem(12)}
              fw={"400"}
              lh={rem(22)}
              color="rgba(255, 255, 255, 0.50)"
              mt={rem(11)}
              mb={rem(32)}
            >
              We will send your tickets to this email when they are ready.
            </Text>
            <Elements stripe={stripePromise} options={options as StripeElementsOptions}>
              <CheckoutForm
                amount={hasConversion ? amount / (paymentInfo?.exchange_rate || 1) : amount}
                setPaymentInfo={setPaymentInfo}
                setCurrentCountry={setCurrentCountry}
                clientSecret={currentPayment?.client_secret as string}
              />
            </Elements>
          </Grid.Col>
        </Grid>
      </Container>
    </NVTLayout>
  );
}
