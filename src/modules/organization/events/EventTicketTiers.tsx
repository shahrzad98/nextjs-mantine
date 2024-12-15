import {
  createTicketTier,
  deleteTicketTier,
  editTicketTier,
  getEvent,
  getTicketTiers,
} from "@/api/handler";
import { useBreakpoint } from "@/hooks";
import { StripeSetupModal, TicketTierForm } from "@/modules";
import userStore from "@/stores/userStore";
import { CustomErrorResponse, isHttpError } from "@/types";
import { ITicketTierRequest, ITicketTierResponse } from "@/types/ticket";
import { errorNotification, successNotification } from "@/utils";
import { eventKey, ticketTiersKey } from "@/utils/queryKeys";
import {
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Modal,
  rem,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NovelTHead, OrganizerDashboardLayout, OrganizerTicketTierCard } from "@/components";

const mobileActionProps = {
  mt: rem(30),
  bottom: 0,
  left: 0,
  p: rem(16),
  bg: "#25262B",
  w: "100%",
  sx: {
    display: "flex",
    justifyContent: "center",
  },
};

export const EventTicketTiers = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
  const [stripeSetupOpened, { open: openStripeSetup }] = useDisclosure(false);

  const currentUser = userStore((state) => state.currentUser);
  const stripeIsActive = currentUser?.data?.organization?.active;

  useEffect(() => {
    if (!!currentUser && !stripeIsActive) {
      openStripeSetup();
    }
  }, [currentUser, openStripeSetup, stripeIsActive]);

  const [activeTier, setActiveTier] = useState<ITicketTierResponse>();
  const [activeDelete, setActiveDelete] = useState<ITicketTierResponse>();

  const queryClient = useQueryClient();

  const {
    data: tiers,
    isSuccess: tiersIsSuccess,
    error: tiersError,
  } = useQuery(
    [eventKey(id as string), ticketTiersKey],
    () => getTicketTiers(id as string).then((res) => res.data),
    {
      enabled: !!id,
      retry: false,
    }
  );

  useEffect(() => {
    if (isHttpError(tiersError)) {
      errorNotification(tiersError as AxiosError);
    }
  }, [tiersError]);

  const { data: eventData, error: eventError } = useQuery(
    [eventKey(id as string)],
    () => getEvent(id as string).then((res) => res.data),
    {
      enabled: !!id,
      initialData: queryClient.getQueryData([eventKey(id as string)]),
    }
  );

  useEffect(() => {
    isHttpError(eventError) && errorNotification(eventError);
  }, [eventError]);

  const { mutate: handleCreate, isLoading: createLoading } = useMutation(
    (formValues: ITicketTierRequest) =>
      createTicketTier(id as string, formValues).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: (res) => {
        const previousData = queryClient.getQueryData<ITicketTierResponse[]>([
          eventKey(id as string),
          ticketTiersKey,
        ]);
        const newData = [...(previousData as ITicketTierResponse[]), res];
        queryClient.setQueryData([eventKey(id as string), ticketTiersKey], newData);

        successNotification({
          title: "Successful",
          message: "Ticket Tier Successfully Added.",
        });

        close();
      },
    }
  );

  const { mutate: handleEdit, isLoading: editLoading } = useMutation(
    (formValues: ITicketTierRequest) =>
      editTicketTier(id as string, activeTier?.id as string, formValues).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: (res) => {
        const previousData = queryClient.getQueryData<ITicketTierResponse[]>([
          eventKey(id as string),
          ticketTiersKey,
        ]);
        const newData = [...(previousData as ITicketTierResponse[])].map((i) => {
          if (i.id === res.id) {
            return res;
          }

          return i;
        });
        queryClient.setQueryData([eventKey(id as string), ticketTiersKey], newData);

        successNotification({
          title: "Successful",
          message: "Ticket Tier Successfully Edited.",
        });

        editClose();
      },
    }
  );

  const { mutate: handleDelete, isLoading: deleteLoading } = useMutation(
    () => deleteTicketTier(id as string, activeDelete?.id as string).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: () => {
        const previousData = queryClient.getQueryData<ITicketTierResponse[]>([
          eventKey(id as string),
          ticketTiersKey,
        ]);
        const newData = [...(previousData as ITicketTierResponse[])].filter(
          (i) => i.id !== activeDelete?.id
        );
        queryClient.setQueryData([eventKey(id as string), ticketTiersKey], newData);

        successNotification({
          title: "Successful",
          message: "Ticket Tier Successfully Deleted.",
        });

        deleteClose();
      },
    }
  );

  const Actions = () => (
    <Group
      spacing={isTablet ? rem(10) : rem(20)}
      pos={isTablet ? "fixed" : undefined}
      {...(isTablet ? mobileActionProps : {})}
      mt={15}
    >
      <Button
        sx={{ fontSize: 15 }}
        w={!isTablet ? 234 : "100%"}
        h={44}
        variant="gradient"
        gradient={{ from: "#3077F3", to: "#15AABF" }}
        fw={"400"}
        fullWidth={isTablet}
        leftIcon={<IconPlus />}
        onClick={() => open()}
      >
        Create New Ticket Tier
      </Button>
      <Button
        w={!isTablet ? 172 : "100%"}
        h={44}
        px={18}
        variant="outline"
        fw={"400"}
        fullWidth={isTablet}
        onClick={() => router.push(`/organization/event/${id}`)}
        sx={{
          fontSize: 15,
          borderImageSource: "linear-gradient(to bottom, #3077F3 , #15AABF )",
          borderImageSlice: "1",
          borderWidth: "1px",
          border: "1px solid",
        }}
      >
        {isTablet ? "Continue" : "Save and Continue"}
      </Button>
    </Group>
  );

  return (
    <OrganizerDashboardLayout
      hasFooter={!isTablet}
      navbarProps={{
        currentPageTitle: "Event Ticket Tiers",
      }}
    >
      <NovelTHead title="Ticket Tiers" />
      <Container size={!isTablet ? rem(1184) : "xs"} mih={"75vh"} mb={rem(80)}>
        {!isTablet && (
          <Flex
            justify={"space-between"}
            align={"center"}
            mt={isTablet ? 50 : 8}
            mb={isTablet ? rem(72) : rem(50)}
          >
            <Title size={isDesktop ? rem(24) : rem(20)} fw={"500"} color="rgba(255, 255, 255, 0.8)">
              Create New Event
            </Title>
            <Actions />
          </Flex>
        )}
        <Grid px={isTablet ? rem(16) : rem(30)} mt={isTablet ? rem(80) : rem(120)}>
          <Grid.Col md={8} lg={8} xs={12}>
            {!isTablet && (
              <Title size={rem(24)} fw={600} color="#E981FA">
                STATUS: DRAFT
              </Title>
            )}
            {isTablet ? (
              <Text size={14} sx={{ lineHeight: 1.8 }}>
                These are your draft Ticket Tiers, click the edit icon to modify them. Once a Ticket
                Tier has tickets and the Event is “Active”, then any Ticket Tier that’s not used
                will be hidden in the marketplace. You will not be able to modify Ticket Tiers once
                an Event is “Active”.
              </Text>
            ) : (
              <Text
                w={isDesktop ? "max-content" : "100%"}
                mt={!isTablet ? rem(18) : undefined}
                lh={rem(27)}
                color="rgba(255, 255, 255, 0.80)"
              >
                <li>These are your draft Ticket Tiers, click the edit icon to modify them.</li>
                <li>
                  Click the delete icon to remove a ticket tier. Keep in mind that you need to have
                  at least one ticket tier in order to publish the event.
                </li>
                <li>You will not be able to modify Ticket Tiers once an Event is “Active”.</li>
              </Text>
            )}
            <Text></Text>
          </Grid.Col>
        </Grid>

        <Modal
          title="Modify Ticket Tiers"
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
          opened={editOpened}
          onClose={editClose}
          keepMounted={false}
        >
          <TicketTierForm
            onClose={editClose}
            submitText="Save and Create"
            onSubmit={(values) => handleEdit(values)}
            initialValue={activeTier}
            submitLoading={editLoading}
            isEdit={true}
            timezoneUtcOffset={eventData?.time_zone.utc_offset || 0}
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
          opened={opened}
          onClose={close}
          keepMounted={false}
        >
          <TicketTierForm
            onClose={close}
            submitText="Save and create"
            onSubmit={(values) => handleCreate(values)}
            submitLoading={createLoading}
            initialValue={tiers?.[0]}
            isEdit={false}
            timezoneUtcOffset={eventData?.time_zone.utc_offset || 0}
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

        <Grid
          mt={isTablet ? rem(24) : rem(35)}
          px={isTablet ? rem(10) : rem(30)}
          gutter={isTablet ? rem(15) : rem(50)}
        >
          {tiersIsSuccess &&
            tiers.map((tier) => (
              <Grid.Col xl={4} xs={12} key={tier.id}>
                <OrganizerTicketTierCard
                  title={tier.name}
                  price={tier.price}
                  ticketsSold={tier.ticket_quantity - tier.available_tickets || 0}
                  totalTickets={tier.ticket_quantity}
                  onEdit={() => {
                    setActiveTier(() => {
                      return tier;
                    });
                    editOpen();
                  }}
                  onDelete={
                    tiers.length > 1
                      ? () => {
                          setActiveDelete(() => {
                            return tier;
                          });
                          deleteOpen();
                        }
                      : undefined
                  }
                />
              </Grid.Col>
            ))}
          {isTablet && (
            <Grid.Col xs={12}>
              <Actions />
            </Grid.Col>
          )}
        </Grid>
      </Container>
      <StripeSetupModal opened={stripeSetupOpened} />
      {isTablet && <Space h={100} />}
    </OrganizerDashboardLayout>
  );
};
