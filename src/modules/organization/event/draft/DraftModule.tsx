import {
  createTicketTier,
  deleteEvent,
  deleteTicketTier,
  editTicketTier,
  publishEvent,
} from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { DraftEventMobileActions, DraftHeader, EventInfo, TicketTierForm } from "@/modules";
import { CustomErrorResponse, IMyEvent, ITicketTierRequest, ITicketTierResponse } from "@/types";
import { errorNotification, getEventDateTimeInfo, successNotification } from "@/utils";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Modal,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import { IconEye, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";

import { AppImage, OrganizerTicketTierCard } from "@/components";
import DownloadQRCode from "@/components/DownloadQRCode";

interface IEventShowModuleProps {
  eventData: IMyEvent;
  refetch: () => void;
}

export const EventDraftModule: FC<IEventShowModuleProps> = ({ eventData, refetch }) => {
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { startTime, weekday, endTime, date } = getEventDateTimeInfo(
    eventData.start_at as string,
    eventData.end_at as string,
    eventData.time_zone.utc_offset
  );
  const isRescheduled = eventData?.status === "rescheduled";
  const isPublishable =
    eventData.ticket_tiers.some((t: { ticket_quantity: number }) => t.ticket_quantity > 0) &&
    !["done", "canceled"].includes(eventData.status);

  const [activeTier, setActiveTier] = useState<ITicketTierResponse>();
  const [activeDelete, setActiveDelete] = useState<ITicketTierResponse>();

  const [qrOpened, { open: openQr, close: closeQr }] = useDisclosure(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);

  const { ref: coverRef, height: coverHeight } = useElementSize();

  const { mutate: publishEventHandle } = useMutation(
    () => publishEvent(router.query.id as string, { event: eventData }),
    {
      onSuccess: () => {
        successNotification({ title: "Successful", message: "Event Successfully Published" });
        router.push("/organization/my-events");
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );
  const { mutate: deleteEventHandle } = useMutation(() => deleteEvent(router.query.id as string), {
    onSuccess: () => {
      successNotification({ title: "Successful", message: "Event Successfully Deleted" });
      router.push("/organization/my-events");
    },
    onError: (error: AxiosError<CustomErrorResponse>) => {
      errorNotification(error);
    },
  });

  const { mutate: handleCreate, isLoading: createTierLoading } = useMutation(
    (formValues: ITicketTierRequest) =>
      createTicketTier(router.query.id as string, formValues).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: () => {
        refetch();

        successNotification({
          title: "Successful",
          message: "Ticket Tier Successfully Added.",
        });

        close();
      },
    }
  );

  const { mutate: handleEdit, isLoading: editTierLoading } = useMutation(
    (formValues: ITicketTierRequest) =>
      editTicketTier(router.query.id as string, activeTier?.id as string, formValues).then(
        (res) => res.data
      ),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: () => {
        refetch();

        successNotification({
          title: "Successful",
          message: "Ticket Tier Successfully Edited.",
        });

        editClose();
      },
    }
  );

  const { mutate: handleDelete, isLoading: deleteLoading } = useMutation(
    () =>
      deleteTicketTier(router.query.id as string as string, activeDelete?.id as string).then(
        (res) => res.data
      ),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: () => {
        refetch();

        successNotification({
          title: "Successful",
          message: "Ticket Tier Successfully Deleted.",
        });

        deleteClose();
      },
    }
  );

  return (
    <>
      <DownloadQRCode
        closeQr={closeQr}
        qrOpened={qrOpened}
        qrURL={`${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventData.slug}`}
      />
      <Box pos="relative" h="100vh">
        <DraftHeader
          isRescheduled={isRescheduled}
          isPublishable={isPublishable}
          isDeletable={!["done", "canceled"].includes(eventData.status)}
          onPublish={publishEventHandle}
          onDelete={deleteEventHandle}
          eventName={eventData.name}
        />
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
            <AppImage
              src={eventData.primary_image ?? ""}
              alt={eventData.name ?? ""}
              fill
              priority
            />
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
        <Container maw={rem(1066)} mt={rem(14)}>
          {!isMobile && (
            <Group
              sx={(theme) => ({ svg: { color: theme.colors.indigo[4] }, cursor: "pointer" })}
              onClick={() => router.push(`/organization/event/${eventData.id}/preview`)}
              spacing={rem(8)}
            >
              <IconEye />
              <Text size="xl">Preview Event Page</Text>
            </Group>
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
            onEdit={() => router.push(`/organization/event/${eventData.id}/edit`)}
          />
          <Divider mt={rem(24)} mb={rem(41)} />
          <Button
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 45 }}
            leftIcon={<IconPlus />}
            h={rem(44)}
            px={rem(18)}
            fw={400}
            fullWidth={isMobile}
            onClick={() => open()}
          >
            Create New Ticket Tier
          </Button>
          <Text
            mt={rem(!isMobile ? 40 : 7.5)}
            c="rgba(255, 255, 255, 0.80)"
            fz={rem(16)}
            lh={rem(27)}
          >
            <li>These are your draft Ticket Tiers, click the edit icon to modify them.</li>
            <li>
              Click the delete icon to remove a ticket tier. Keep in mind that you need to have at
              least one ticket tier in order to publish the event.
            </li>
            <li>You will not be able to modify Ticket Tiers once an Event is “Active”.</li>
          </Text>
          <Grid mt={rem(!isMobile ? 20 : 7.5)} gutter={rem(isDesktop ? 50 : 15)}>
            {eventData.ticket_tiers.map((ticket) => (
              <Grid.Col span={12} sm={6} md={4} key={ticket.name}>
                <OrganizerTicketTierCard
                  title={ticket.name}
                  ticketsSold={ticket.ticket_quantity - ticket.available_tickets}
                  totalTickets={ticket.ticket_quantity}
                  price={ticket.price}
                  onEdit={() => {
                    setActiveTier(() => {
                      return ticket;
                    });
                    editOpen();
                  }}
                  onDelete={
                    eventData.ticket_tiers.length > 1
                      ? () => {
                          setActiveDelete(() => {
                            return ticket;
                          });
                          deleteOpen();
                        }
                      : undefined
                  }
                />
              </Grid.Col>
            ))}

            <Modal
              title="Edit Ticket Tiers"
              centered={true}
              withCloseButton={false}
              size={isMobile ? rem(336) : rem(406)}
              styles={{
                content: {
                  width: 306,
                  padding: isMobile ? "40px 15px" : "40px 50px",
                  backgroundColor: "rgba(40, 43, 61, 1)",
                  input: {
                    background: "#282B3D",
                    borderColor: "#1E2130",
                  },
                  textArea: {
                    background: "#282B3D",
                    borderColor: "#1E2130",
                  },
                },
                body: {
                  padding: 0,
                },
                header: {
                  background: "rgba(40, 43, 61, 1)",
                  color: "rgba(255, 255, 255, 0.8)",
                },
                title: {
                  fontSize: rem(24),
                  textAlign: "center",
                  width: "100%",
                  fontWeight: 500,
                },
              }}
              key={activeTier?.id}
              opened={editOpened}
              onClose={editClose}
              keepMounted={false}
            >
              <TicketTierForm
                onClose={editClose}
                submitText="Update"
                onSubmit={(values) => handleEdit(values)}
                initialValue={activeTier}
                submitLoading={editTierLoading}
                isEdit={true}
                timezoneUtcOffset={eventData.time_zone.utc_offset}
              />
            </Modal>

            <Modal
              title="Create Ticket Tiers"
              centered={true}
              withCloseButton={false}
              size={isMobile ? rem(336) : rem(406)}
              styles={{
                content: {
                  width: 306,
                  padding: isMobile ? "40px 15px" : "40px 50px",
                  backgroundColor: "rgba(40, 43, 61, 1)",
                  input: {
                    background: "#282B3D",
                    borderColor: "#1E2130",
                  },
                  textArea: {
                    background: "#282B3D",
                    borderColor: "#1E2130",
                  },
                },
                body: {
                  padding: 0,
                },
                header: {
                  background: "rgba(40, 43, 61, 1)",
                  color: "rgba(255, 255, 255, 0.8)",
                },
                title: {
                  fontSize: rem(24),
                  textAlign: "center",
                  width: "100%",
                  fontWeight: 500,
                },
              }}
              key={activeTier?.id}
              opened={opened}
              onClose={close}
              keepMounted={false}
            >
              <TicketTierForm
                onClose={close}
                submitText="Save and create"
                onSubmit={(values) => handleCreate(values)}
                submitLoading={createTierLoading}
                initialValue={{
                  ...eventData?.ticket_tiers?.[0],
                  seats: 1,
                  event: {
                    end_at: eventData?.end_at as string,
                    start_at: eventData?.start_at as string,
                    id: eventData?.id as string,
                  },
                }}
                isEdit={false}
                timezoneUtcOffset={eventData.time_zone.utc_offset}
              />
            </Modal>

            <Modal
              title="Delete Ticket Tier"
              centered={true}
              withCloseButton={false}
              styles={{
                header: {
                  background: "rgba(40, 43, 61, 1)",
                  color: "rgba(255, 255, 255, 0.8)",
                },
                body: {
                  padding: 0,
                },
                content: {
                  padding: isMobile ? "26px 22px" : "32px 28px",
                  backgroundColor: "rgba(40, 43, 61, 1)",
                },
                title: {
                  fontSize: rem(24),
                  textAlign: "center",
                  width: "100%",
                },
              }}
              size={isMobile ? rem(324) : rem(380)}
              opened={deleteOpened}
              onClose={deleteClose}
              keepMounted={false}
            >
              <Text
                color="dimmed"
                fz={rem(16)}
                fw={300}
                align="center"
                sx={{ margin: "auto" }}
                maw={isMobile ? "unset" : 236}
                size={isMobile ? rem(14) : rem(16)}
              >
                Are you sure you want to delete {activeDelete?.name}?
              </Text>

              <Stack align="center" mt={rem(33)} spacing={rem(12)}>
                <Button
                  color="red"
                  fullWidth
                  maw={rem(266)}
                  h={rem(44)}
                  fs={rem(15)}
                  fw={400}
                  onClick={() => handleDelete()}
                  loading={deleteLoading}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  mb={rem(18)}
                  maw={rem(266)}
                  h={rem(44)}
                  fs={rem(15)}
                  fw={400}
                  onClick={deleteClose}
                >
                  Cancel
                </Button>
              </Stack>
            </Modal>
          </Grid>
        </Container>
        {isTablet && (
          <DraftEventMobileActions
            isPublishable={isPublishable}
            onPublish={publishEventHandle}
            isRescheduled={isRescheduled}
            onDelete={deleteEventHandle}
            eventName={eventData.name}
          />
        )}
      </Box>
    </>
  );
};
