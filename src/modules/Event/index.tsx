import { cartAddItem, cartRemoveItem, deleteCart, getEventCart } from "@/api/handler/checkout";
import checkGuestToken from "@/common/checkGuestToken";
import { createWebsocketConnection } from "@/helpers/createSocketConnection";
import { useBreakpoint } from "@/hooks";
import { ExpandableText } from "@/modules";
import checkoutStore from "@/stores/cartStore";
import userStore from "@/stores/userStore";
import { IMyEvent, ITicketCount, IUserStore } from "@/types";
import { ICartItem, ICheckoutStore } from "@/types/cart";
import { errorNotification, getEventDateTimeInfo } from "@/utils";
import { eventCartKey } from "@/utils/queryKeys";
import {
  Anchor,
  Box,
  Center,
  createStyles,
  Divider,
  Flex,
  Grid,
  Modal,
  rem,
  Tabs,
  TabsProps,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import { IconCalendarEvent, IconClockHour5, IconMapPin, IconQrcode } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import { AppImage, TicketTierCard } from "@/components";
import DownloadQRCode from "@/components/DownloadQRCode";

import { EventModuleSkeleton } from "./Skeleton";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function StyledTabs(props: TabsProps) {
  return (
    <Tabs
      radius={8}
      styles={(theme) => ({
        tab: {
          border: "1px solid",
          borderColor: "#373A40",
          minWidth: rem(150),
          justifyContent: "center",
          "&[data-active]": {
            //background: `linear-gradient(45deg, ${theme.colors.nvtPrimary[2]} 0%, ${theme.colors.nvtPrimary[1]} 100%)`,
            backgroundColor: theme.colors.nvtPrimary?.[5],
            color: "#1971c2",
            borderColor: "#1971c2",
            "&:hover": {
              backgroundColor: theme.colors.nvtPrimary?.[5],
            },
          },
        },
        tabsList: {
          gap: rem(12),
          flexWrap: "nowrap",
          overflowX: "auto",
        },
      })}
      {...props}
    />
  );
}

const NoSSrMap = dynamic(() => import("../../components/LeafletMap"), {
  ssr: false,
});

const useStyles = createStyles((theme) => ({
  modalRoot: {
    "& .mantine-Modal-content, .mantine-Modal-header": {
      background: theme.colors.nvtPrimary[5],
    },
    "& .mantine-Modal-header": {
      height: 35,
    },
  },
  cursorPointer: {
    cursor: "pointer",
  },
}));

interface IEventShowModuleProps {
  eventData: IMyEvent;
  isSuccess: boolean;
}

export const EventModule: FC<IEventShowModuleProps> = ({ eventData, isSuccess }) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [contactModalOpened, { open: contactModalOpen, close: contactModalClose }] =
    useDisclosure(false);
  const [qrOpened, { open: openQr, close: closeQr }] = useDisclosure(false);

  const [ticketCount, setTicketCount] = useState<{ id: string; available_tickets: number }[]>([]);

  const { ref: coverRef, height: coverHeight } = useElementSize();

  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const token = currentUser?.token;
  const canPurchase =
    currentUser?.data?.role !== "owner" &&
    currentUser?.data?.role !== "admin" &&
    currentUser?.data?.role !== "operator";

  const setCheckoutData = checkoutStore((state: ICheckoutStore) => state.setCheckout);
  const emptyCheckout = checkoutStore((state: ICheckoutStore) => state.emptyCheckout);
  const checkoutData = checkoutStore((state: ICheckoutStore) => state.checkout);
  const eventCart = checkoutData?.cart;
  const eventPurchase = checkoutData?.purchase;

  const checkLocalCart = () => {
    const currentTime = new Date().getTime();
    const expireTime = new Date(eventCart?.expires_at as string).getTime();
    if (currentTime > expireTime) {
      emptyCheckout();
    }
  };

  const {
    data: currentCartData,
    isLoading: isCurrentCartDataLoading,
    isSuccess: isCurrentCartDataSuccess,
  } = useQuery(
    [eventCartKey(eventCart?.id as string)],
    () => getEventCart(eventCart?.token as string).then((res) => res.data),
    {
      enabled: !!eventCart?.id,
    }
  );

  useEffect(() => {
    checkLocalCart();
    if (isSuccess) {
      setTicketCount(
        eventData.ticket_tiers.map((item) => ({
          id: item.id,
          available_tickets: item.available_tickets,
        }))
      );
    }
  }, [isSuccess, eventData]);

  const utcOffsetInSeconds = eventData?.time_zone?.utc_offset || 0;

  const {
    startTime,
    weekday,
    endTime,
    remainingDays,
    isBefore: isConcluded,
    date,
  } = getEventDateTimeInfo(eventData?.start_at || "", eventData?.end_at || "", utcOffsetInSeconds);

  const isCanceled = eventData?.status === "canceled";

  useEffect(() => {
    if (isSuccess) {
      createWebsocketConnection(
        {
          event_slug: eventData.slug,
          channel: "TicketTierChannel",
        },
        (message: { [key: string]: string | number }) => {
          if (message.message === "ticket_tier_updated") {
            setTicketCount((prev) =>
              prev.map((item) =>
                item.id === message.ticket_tier_id
                  ? {
                      ...item,
                      available_tickets: message.available_tickets as number,
                    }
                  : item
              )
            );
          }
        }
      );
    }
  }, [isSuccess]);

  const { mutate: handleAddToCart, isLoading: addToCartLoading } = useMutation(
    ({ event_id, ticket_tier_id }: { event_id: string; ticket_tier_id: string }) =>
      cartAddItem(event_id, ticket_tier_id),
    {
      onSuccess: (res) => {
        setCheckoutData({
          cart: res.data,
        });
      },
      onError: (e: AxiosError<ICartItem>) => {
        errorNotification(e);
      },
    }
  );

  const { mutate: handleRemoveFromCart, isLoading: removeFromCartLoading } = useMutation(
    ({ event_id, ticket_tier_id }: { event_id: string; ticket_tier_id: string }) =>
      cartRemoveItem(event_id, ticket_tier_id),
    {
      onSuccess: (res) => {
        setCheckoutData({
          cart: res.data,
        });
      },
      onError: (e: AxiosError<ICartItem>) => {
        errorNotification(e);
      },
    }
  );

  const {
    mutate: handleDeleteCart,
    mutateAsync: handleDeleteCartAsync,
    isLoading: deleteCartIsLoading,
  } = useMutation(() => deleteCart(eventCart?.token as string), {
    onSuccess: (_res: AxiosResponse) => {
      setCheckoutData({
        cart: undefined,
      });
    },
    onError: (e: AxiosError) => {
      errorNotification(e);
    },
  });

  if (!isSuccess) return <EventModuleSkeleton />;

  function getDaysBetween(start: Dayjs, end: Dayjs) {
    const range = [];
    let current = start;
    while (!current.isAfter(end)) {
      range.push(current);
      current = current.add(1, "days");
    }

    return range;
  }

  const dayArray = eventData.ticket_tiers
    .map((item) =>
      getDaysBetween(
        dayjs.utc(item.start_at).add(utcOffsetInSeconds, "second"),
        dayjs.utc(item.end_at).add(utcOffsetInSeconds, "second")
      ).map((day) => day.toISOString())
    )
    .flat()
    .sort();

  const uniqueDayArray = dayArray.filter((x, i, a) => a.indexOf(x) == i);

  const dayList = uniqueDayArray.map((item) => {
    const dateShiftedByTimezone = dayjs.utc(item);

    return {
      dayOfMonth: dateShiftedByTimezone.format("D"),
      nameOfDay: dateShiftedByTimezone.format("dddd"),
      month: dateShiftedByTimezone.format("MMMM"),
      year: dateShiftedByTimezone.format("YYYY"),
      value: dateShiftedByTimezone.toISOString(),
    };
  });

  return (
    <>
      <DownloadQRCode
        closeQr={closeQr}
        qrOpened={qrOpened}
        qrURL={`${window.location.protocol}//${window.location.host}/event/${eventData.slug}`}
      />
      <Modal
        opened={contactModalOpened}
        onClose={contactModalClose}
        className={classes.modalRoot}
        centered
      >
        <Box px={24}>
          <Center>
            <Text size="xl" weight={600} mb="sm">
              Contact Details
            </Text>
          </Center>
          <Flex align="center" mb="lg">
            <Box
              sx={{ borderRadius: "100%", overflow: "hidden", position: "relative" }}
              w={35}
              h={35}
            >
              <AppImage
                src={eventData?.organization?.cover_photo as string}
                alt={eventData?.organization?.name}
                fill
                priority
                wrapperHeight={35}
              />
            </Box>
            <Text size={rem(20)} ml="sm" weight={300} c="rgba(255, 255, 255, 0.70)">
              {eventData?.organization?.name}
            </Text>
          </Flex>
          {eventData?.contact_email && (
            <Box mb="sm">
              <Text size={rem(14)} component="span" color="#E981FA">
                Email:&nbsp;
              </Text>
              <Anchor href={`mailto:${eventData.contact_email}`}>
                <Text underline size={rem(14)} component="span" c="rgba(255, 255, 255, 0.80)">
                  {eventData.contact_email}
                </Text>
              </Anchor>
            </Box>
          )}
          <Box mb={36}>
            {eventData?.contact_phone && (
              <>
                <Text size={rem(14)} component="span" color="#E981FA">
                  Phone Number:&nbsp;
                </Text>
                <Anchor href={`tel:+${eventData.contact_phone.replace("-", "")}`}>
                  <Text underline size={rem(14)} component="span" c="rgba(255, 255, 255, 0.80)">
                    +{eventData.contact_phone.replace("-", "")}
                  </Text>
                </Anchor>
              </>
            )}
          </Box>
        </Box>
      </Modal>
      <Box sx={{ position: "relative" }} mt={isTablet ? 60 : undefined}>
        <Box
          ref={coverRef}
          maw={1076}
          mx="auto"
          sx={{
            position: "relative",
            margin: "auto",
            "& img": {
              position: "relative !important" as "relative",
              objectFit: "contain",
              maskImage: isMobile
                ? undefined
                : "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) )",
              maxHeight: rem(isMobile ? 281 : 480),
            },
          }}
        >
          <AppImage src={eventData.primary_image ?? ""} alt={eventData.name ?? ""} fill priority />
        </Box>
        <Box
          w="100%"
          h={coverHeight}
          sx={{
            position: "absolute",
            top: 0,
            margin: "auto",
            "& img": {
              objectFit: "cover",
              maskImage: "linear-gradient(rgba(0,0,0,1), rgba(0,0,0,1))",
              filter: `blur(${rem(15)})`,
              zIndex: -1,
            },
          }}
        >
          <AppImage
            src={eventData.primary_image ?? ""}
            alt={eventData.name ?? ""}
            wrapperHeight={coverHeight}
            fill
            priority
          />
        </Box>
      </Box>
      <Box maw={1076} mx="auto" my={isTablet ? "md" : 50} px={!isDesktop ? 20 : undefined}>
        <Flex direction={isTablet ? "column-reverse" : "row"}>
          <Box w={isTablet ? "auto" : 740}>
            {!isTablet && (
              <Box h={103} py={rem(10)}>
                <Title
                  order={1}
                  size={rem(36)}
                  lineClamp={2}
                  fw={700}
                  color="rgba(255, 255, 255, 0.80)"
                >
                  {eventData.name}
                </Title>
              </Box>
            )}
            {!isTablet && (
              <Flex justify="space-between" align="center">
                <Flex
                  onClick={() =>
                    router.push(`/marketplace/${eventData?.organization?.slug.toLowerCase()}`)
                  }
                  align="center"
                  mb="lg"
                  sx={{ cursor: "pointer" }}
                >
                  <Box
                    sx={{ borderRadius: "100%", overflow: "hidden", position: "relative" }}
                    w={35}
                    h={35}
                  >
                    <AppImage
                      src={eventData?.organization?.cover_photo as string}
                      alt={eventData?.organization?.name}
                      fill
                      priority
                      wrapperHeight={35}
                    />
                  </Box>
                  <Text size={rem(20)} ml={rem(9)} color="rgba(255, 255, 255, 0.70)" weight={300}>
                    {eventData?.organization?.name}
                  </Text>
                </Flex>
                {(eventData.contact_phone || eventData.contact_email) && (
                  <Text
                    className={classes.cursorPointer}
                    size="md"
                    weight={600}
                    color={theme.colors.blue[9]}
                    onClick={contactModalOpen}
                  >
                    Show contact details
                  </Text>
                )}
              </Flex>
            )}

            <ExpandableText maxHeight={isMobile ? 110 : 95}>
              <Text
                sx={{
                  p: {
                    margin: 0,
                    fontSize: rem(isMobile ? 16 : 20),
                    lineHeight: rem(isMobile ? 22 : 30),
                    minHeight: rem(isMobile ? 22 : 30),
                  },
                  iframe: {
                    width: "100%",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: eventData.description }}
              />
            </ExpandableText>

            {isTablet && (
              <Flex direction="column">
                <Flex
                  align="center"
                  mt={rem(20)}
                  onClick={() =>
                    router.push(`/marketplace/${eventData?.organization?.slug.toLowerCase()}`)
                  }
                  sx={{ cursor: "pointer" }}
                  w="fit-content"
                >
                  <Box
                    sx={{ borderRadius: "100%", overflow: "hidden", position: "relative" }}
                    w={24}
                    h={24}
                  >
                    <AppImage
                      src={eventData?.organization?.cover_photo as string}
                      alt={eventData?.organization?.name}
                      fill
                      priority
                      wrapperHeight={24}
                    />
                  </Box>
                  <Text size={rem(14)} ml={rem(13)} color="rgba(255, 255, 255, 0.70)">
                    {eventData?.organization?.name}
                  </Text>
                </Flex>
                {(eventData.contact_phone || eventData.contact_email) && (
                  <Text
                    mt={rem(26)}
                    className={classes.cursorPointer}
                    size="md"
                    weight={600}
                    color={theme.colors.nvtPrimary[2]}
                    onClick={contactModalOpen}
                  >
                    Show contact details
                  </Text>
                )}
              </Flex>
            )}
          </Box>
          <Box ml={isTablet ? 0 : 100}>
            {!isConcluded && !isCanceled && (
              <Text size={rem(isTablet ? 18 : 24)} mb={rem(isTablet ? 20 : 58)} color="#E981FA">
                {eventData.available_tickets > 0
                  ? `${eventData.available_tickets} Tickets Left`
                  : eventData.available_tickets === 0
                  ? "Tickets SOLD OUT"
                  : ""}
              </Text>
            )}
            {isTablet && (
              <Title
                order={1}
                size={rem(26)}
                lineClamp={1}
                mb={rem(20)}
                color="rgba(255, 255, 255, 0.80)"
              >
                {eventData.name}
              </Title>
            )}
            <Flex mb={rem(8)} align="center">
              <Box>
                <IconCalendarEvent color={theme.colors.grape[4]} />
              </Box>
              <Text
                size={isTablet ? 12 : 16}
                ml={rem(isTablet ? 8 : 11)}
                lh={1}
                color="rgba(255, 255, 255, 0.80)"
              >
                {weekday}, {date}
              </Text>
            </Flex>
            <Flex mb={rem(8)} align="center">
              <Box>
                <IconClockHour5 color={theme.colors.grape[4]} />
              </Box>
              <Text
                size={isTablet ? 12 : 16}
                ml={rem(isTablet ? 8 : 11)}
                lh={1}
                color="rgba(255, 255, 255, 0.80)"
              >
                {startTime} - {endTime} {eventData.time_zone.abbr}
              </Text>
            </Flex>
            <Flex mb={rem(15)} align="center">
              <Box>
                <IconMapPin color={theme.colors.grape[4]} />
              </Box>
              <Text
                size={isTablet ? 12 : 16}
                ml={rem(isTablet ? 8 : 11)}
                lh={1.5}
                maw={336}
                lineClamp={2}
                color="rgba(255, 255, 255, 0.80)"
              >
                {eventData.address ? eventData.address + ", " : null}
                {eventData.city ? eventData.city + ", " : null}
                {eventData.province_state ? eventData.province_state + ", " : null}
                {eventData.country ?? ""}
              </Text>
            </Flex>
            <Text
              size={rem(isTablet ? 14 : 20)}
              color={isConcluded || isCanceled ? "#E03130" : theme.primaryColor}
              weight={300}
              my={rem(isTablet ? 15 : 24)}
            >
              {!isCanceled && isConcluded
                ? "This event has concluded"
                : isCanceled
                ? "This event was canceled"
                : remainingDays}
            </Text>
            <Flex mb={15} onClick={openQr} sx={{ cursor: "pointer" }}>
              <IconQrcode size={25} color="#3077F3" />
              <Text size="md" color="#3077F3" ml={10}>
                Download QR Code
              </Text>
            </Flex>
          </Box>
        </Flex>

        <Divider my={isTablet ? 26 : 40} />
        <Box mb={isTablet ? 30 : 50}>
          <Text component="span" size={isTablet ? "sm" : "md"}>
            Buy your tickets today! All tickets listed on novelT are coming from our registered and
            trusted sellers only.
          </Text>
          <Anchor
            href="/ticketing-services-agreement"
            ml="xs"
            color={theme.colors.nvtPrimary[2]}
            sx={{
              "&:hover": { textDecoration: "none" },
              borderBottom: `1px solid ${theme.colors.nvtPrimary[2]}`,
            }}
            target="_blank"
          >
            Learn more
          </Anchor>
        </Box>

        <StyledTabs variant="pills" defaultValue={"day-0"} mb={rem(30)}>
          <Tabs.List>
            {dayList.map((item, i) => (
              <Tabs.Tab
                key={`tab-${i}`}
                value={`day-${i}`}
                sx={{
                  "&[data-active]": {
                    ".dayOfMonth": {
                      background: `linear-gradient(45deg, ${theme.colors.nvtPrimary[2]} 0%, ${theme.colors.nvtPrimary[1]} 100%)`,
                    },
                  },
                }}
              >
                <Flex direction={"column"} align={"center"} gap={rem(10)}>
                  <Text fw={700} fz={"1.25rem"}>
                    {item.nameOfDay}
                  </Text>
                  <Flex
                    className="dayOfMonth"
                    w={rem(38)}
                    h={rem(38)}
                    c={"#fff"}
                    sx={{
                      borderRadius: "50%",
                      background: "#FFFFFF80",
                    }}
                    align={"center"}
                    justify={"center"}
                  >
                    {item.dayOfMonth}
                  </Flex>
                  <Text ta={"left"} fz={"0.85rem"}>
                    {item.month} {item.year}
                  </Text>
                </Flex>
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {dayList.map((day, i) => (
            <Tabs.Panel value={`day-${i}`} pt="md" key={`panel-${i}`}>
              <Grid gutter={isMobile ? 0 : 50} p={25} align="flex-start">
                {!isConcluded && !isCanceled ? (
                  eventData.ticket_tiers.map((item) => {
                    return dayjs(day.value).isSameOrAfter(
                      dayjs
                        .utc(item.start_at)
                        .add(utcOffsetInSeconds, "second")
                        .format("YYYY/MM/DD"),
                      "day"
                    ) &&
                      dayjs(day.value).isSameOrBefore(
                        dayjs
                          .utc(item.end_at)
                          .add(utcOffsetInSeconds, "second")
                          .format("YYYY/MM/DD"),
                        "day"
                      ) ? (
                      <Grid.Col
                        sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}
                        span={isMobile ? 12 : isTablet ? 6 : 4}
                        key={item.id}
                      >
                        <TicketTierCard
                          title={item.name}
                          priceCAD={item.price}
                          startDate={dayjs(item.start_at)
                            .add(utcOffsetInSeconds, "second")
                            .toISOString()}
                          endDate={dayjs(item.end_at)
                            .add(utcOffsetInSeconds, "second")
                            .toISOString()}
                          timezone={eventData.time_zone.abbr}
                          ticketsLeft={
                            ticketCount.find((ticket) => ticket.id === item.id)
                              ?.available_tickets ?? null
                          }
                          defaultTicketNumber={
                            isCurrentCartDataSuccess && currentCartData?.ticket_tier_id === item.id
                              ? (currentCartData.quantity as ITicketCount)
                              : 0
                          }
                          description={item.description}
                          handleRemove={async () => {
                            checkLocalCart();
                            if (eventPurchase) {
                              emptyCheckout();
                            }
                            await checkGuestToken();
                            handleRemoveFromCart({
                              event_id: eventData.id,
                              ticket_tier_id: item.id,
                            });
                          }}
                          shouldResetOnAdd={!!eventCart && eventCart?.ticket_tier_id !== item.id}
                          handleAdd={async () => {
                            checkLocalCart();
                            if (eventPurchase) {
                              emptyCheckout();
                            }
                            if (
                              !!eventCart &&
                              eventCart?.ticket_tier_id !== item.id &&
                              eventCart?.id
                            ) {
                              await handleDeleteCartAsync();
                            }
                            await checkGuestToken();
                            handleAddToCart({ event_id: eventData.id, ticket_tier_id: item.id });
                          }}
                          handleSubmit={() => {
                            checkLocalCart();
                            setCheckoutData({
                              event: eventData,
                            });
                            if (!canPurchase) return;
                            if (token) {
                              router.push("/checkout/pay");
                            } else {
                              router.push("/checkout/auth/signup");
                            }
                          }}
                          handleDeleteCart={() => handleDeleteCart()}
                          addLoading={
                            addToCartLoading ||
                            deleteCartIsLoading ||
                            (!!eventCart?.id && isCurrentCartDataLoading)
                          }
                          removeLoading={removeFromCartLoading}
                          canPurchase={
                            canPurchase && dayjs.utc().isSameOrBefore(dayjs.utc(item.end_at))
                          }
                        />
                      </Grid.Col>
                    ) : (
                      <></>
                    );
                  })
                ) : (
                  <></>
                )}
              </Grid>
            </Tabs.Panel>
          ))}
        </StyledTabs>
      </Box>
      <NoSSrMap
        position={
          eventData.lat
            ? {
                lat: eventData.lat,
                lng: eventData.lng,
              }
            : undefined
        }
        mx="auto"
        mt={isMobile ? 45 : 0}
        mb={72}
        maw={1067}
        h={343}
      />
    </>
  );
};
