import { useBreakpoint } from "@/hooks";
import { EventInfo, SoldUnsoldTickets, TicketsChartInfo } from "@/modules";
import { IEventAttendee, IMyEvent } from "@/types";
import { getEventDateTimeInfo } from "@/utils";
import {
  Anchor,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Flex,
  Grid,
  rem,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconPencil,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";

import { AppImage, OrganizerTicketTierCard } from "@/components";
import DownloadQRCode from "@/components/DownloadQRCode";

import { AttendeeList } from "./AttendeeList";
import { EventPromoterList } from "./EventPromoterList";

interface IEventShowModuleProps {
  eventData: IMyEvent;
  attendeeData: IEventAttendee[];
}

export const EventPublishModule: FC<IEventShowModuleProps> = ({ eventData, attendeeData }) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [qrOpened, { open: openQr, close: closeQr }] = useDisclosure(false);
  const { isMobile, isTablet } = useBreakpoint();
  const [overviewOpened, { toggle: toggleOverview }] = useDisclosure(false);
  const [ticketTiersOpened, { toggle: toggleTicketTiers }] = useDisclosure(false);
  const { startTime, weekday, endTime, date } = getEventDateTimeInfo(
    eventData.start_at as string,
    eventData.end_at as string,
    eventData.time_zone.utc_offset
  );
  const { ref: coverRef, height: coverHeight } = useElementSize();

  const ticketSalesOverview = (
    <>
      {!isMobile && (
        <Text size="xl" mt={rem(34)} mb={rem(10)}>
          Ticket Sales Overview
        </Text>
      )}
      <TicketsChartInfo
        sold={eventData.ticket_quantity - eventData.available_tickets}
        unsold={eventData.available_tickets}
      />
      <Grid>
        <Grid.Col span={isMobile ? 12 : 6}>
          <SoldUnsoldTickets
            ticketTiers={eventData.ticket_tiers}
            totalTickets={eventData.ticket_quantity}
            sold={eventData.ticket_quantity - eventData.available_tickets}
            isSold
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <SoldUnsoldTickets
            ticketTiers={eventData.ticket_tiers}
            totalTickets={eventData.ticket_quantity}
            sold={eventData.ticket_quantity - eventData.available_tickets}
            isSold={false}
          />
        </Grid.Col>
      </Grid>
    </>
  );

  const ticketTiers = (
    <>
      {!isMobile && (
        <Text size="xl" my={rem(36)}>
          Ticket Tiers
        </Text>
      )}
      <Grid gutter={isMobile ? 15 : 50}>
        {eventData.ticket_tiers.map((ticket, index) => (
          <Grid.Col key={index} span={isMobile ? 12 : 4}>
            <OrganizerTicketTierCard
              title={ticket.name}
              ticketsSold={ticket.ticket_quantity - ticket.available_tickets}
              totalTickets={ticket.ticket_quantity}
              price={ticket.price}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );

  return (
    <>
      <DownloadQRCode
        closeQr={closeQr}
        qrOpened={qrOpened}
        qrURL={`${window.location.protocol}//${window.location.host}/event/${eventData.slug}`}
      />
      <Container maw={rem(1186)}>
        <Flex
          h={rem(isMobile ? 48 : 81)}
          mb={rem(isMobile ? 19 : 0)}
          justify="space-between"
          align="center"
        >
          {!isTablet && (
            <>
              <Title order={3}>Event Page</Title>
              {eventData?.status !== "done" && eventData?.status !== "canceled" && (
                <Button
                  component={Link}
                  href={`/organization/event/${router.query.id}/edit`}
                  h={rem(44)}
                  fw={400}
                  fs={rem(15)}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 45 }}
                  leftIcon={<IconPencil />}
                >
                  Edit Event
                </Button>
              )}
            </>
          )}
        </Flex>
      </Container>
      <Box sx={{ position: "relative" }}>
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
      <Box maw={1080} mx="auto" my={isTablet ? "md" : "xl"} px={16}>
        {!isTablet && eventData?.status !== "done" && eventData?.status !== "canceled" && (
          <Anchor href={`/event/${eventData.slug}`} underline={false} color={theme.colors.gray[5]}>
            <Flex mb="lg" align="center" mt={28}>
              <IconEye size={24} strokeWidth={1.5} color={"#7791F9"} />
              <Text size={rem(20)} ml={8} c={"#FFFFFFCC"}>
                View Event Page
              </Text>
            </Flex>
          </Anchor>
        )}
        <EventInfo
          openQr={openQr}
          title={eventData.name}
          description={eventData.description}
          status={eventData.status}
          date={[weekday, date].join(", ")}
          time={`${startTime} - ${endTime} ${eventData.time_zone.abbr}`}
          is_private={eventData.is_private}
          location={`${eventData.address ? eventData.address + ", " : ""}${
            eventData.city ? eventData.city + ", " : ""
          }${eventData.province_state ? eventData.province_state + ", " : ""}${
            eventData.country ?? ""
          }`}
          onEdit={
            eventData?.status === "done" || eventData?.status === "canceled"
              ? null
              : () => router.push(`/organization/event/${router.query.id}/edit`)
          }
        />

        <Tabs
          defaultValue="analytics"
          mt={"md"}
          mb={!isMobile ? rem(60) : undefined}
          styles={{
            tabLabel: {
              fontSize: rem(20),
            },
            tabsList: {
              flexWrap: isMobile ? "nowrap" : undefined,
              overflowX: isMobile ? "auto" : undefined,
              overflowY: isMobile ? "hidden" : undefined,
            },
            tab: {
              paddingLeft: rem(10),
              paddingRight: rem(10),
              marginRight: rem(20),
              "&[data-active]": {
                color: "#FFFFFFCC",
                borderColor: "#7791F9",
              },
            },
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
            <Tabs.Tab value="attendeeList">Attendee List</Tabs.Tab>
            <Tabs.Tab value="promoters">Promoters</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="analytics">
            <Box h={isMobile ? rem(34) : rem(50)} />
            {isMobile ? (
              <>
                <Flex
                  justify="space-between"
                  align="center"
                  onClick={() => toggleOverview()}
                  mb={overviewOpened ? "md" : 0}
                >
                  <Text size="md" weight={500}>
                    Ticket Sales Overview
                  </Text>
                  {overviewOpened ? (
                    <Box>
                      <IconChevronUp size={24} strokeWidth={2} color={theme.colors.gray[6]} />
                    </Box>
                  ) : (
                    <Box>
                      <IconChevronDown size={24} strokeWidth={2} color={theme.colors.gray[6]} />
                    </Box>
                  )}
                </Flex>
                <Collapse in={overviewOpened}>{ticketSalesOverview}</Collapse>
              </>
            ) : (
              ticketSalesOverview
            )}
            {isMobile && <Divider my={isMobile ? 15 : 20} />}
            {isMobile ? (
              <>
                <Flex
                  justify="space-between"
                  align="center"
                  onClick={() => toggleTicketTiers()}
                  mb={ticketTiersOpened ? "md" : 0}
                >
                  <Text size="md" weight={500}>
                    Ticket Tiers
                  </Text>
                  {ticketTiersOpened ? (
                    <Box>
                      <IconChevronUp size={24} strokeWidth={2} color={theme.colors.gray[6]} />
                    </Box>
                  ) : (
                    <Box>
                      <IconChevronDown size={24} strokeWidth={2} color={theme.colors.gray[6]} />
                    </Box>
                  )}
                </Flex>
                <Collapse in={ticketTiersOpened}>{ticketTiers}</Collapse>
                {isMobile && <Divider mt={15} mb={40} />}
              </>
            ) : (
              ticketTiers
            )}
          </Tabs.Panel>

          <Tabs.Panel value="promoters">
            <EventPromoterList eventId={eventData?.id} />
          </Tabs.Panel>

          <Tabs.Panel value="attendeeList">
            {attendeeData?.length > 0 && <AttendeeList data={attendeeData} />}
            {attendeeData?.length === 0 && (
              <Flex direction={"column"} mt={isMobile ? rem(34) : rem(50)}>
                <IconUsers size={"4rem"} color="#5F5F62" />
                <Text c={"#FFFFFF4D"} size={rem(24)} lh={rem(25)} fw={400} my={rem(11)}>
                  There are currently no attendees for this event.
                </Text>
                <Text size={rem(16)} lh={rem(22)} c={"#FFFFFFB2"} fw={400} maw={rem(698)}>
                  After attendees make purchases for this event, their details will appear here. You
                  can review their purchase information, including ticket tier and price, from this
                  section.
                </Text>
              </Flex>
            )}
          </Tabs.Panel>
        </Tabs>
      </Box>

      {isMobile && (
        <Flex px={30} py={15} bg="dark" pos="sticky" sx={{ bottom: 0 }}>
          <Button
            variant="outline"
            h={44}
            fullWidth
            color="blue"
            onClick={() => router.push("/organization/my-events")}
          >
            <Text color={theme.colors.blue[6]} ml="xs" size="md" weight={600}>
              View My Events
            </Text>
          </Button>
          {eventData?.status !== "done" && eventData?.status !== "canceled" && (
            <Button
              ml={20}
              w={60}
              h={44}
              color="blue"
              onClick={() => router.push(`/organization/event/${router.query.id}/edit`)}
            >
              <IconPencil />
            </Button>
          )}
        </Flex>
      )}
    </>
  );
};
