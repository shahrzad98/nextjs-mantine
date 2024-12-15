import { sendTicket } from "@/api/handler";
import userStore from "@/stores/userStore";
import { CustomErrorResponse } from "@/types";
import { IPurchase, IPurchaseTicket } from "@/types/purchase";
import { emailRegex, errorNotification, getEventDateTimeInfo, successNotification } from "@/utils";
import { Modal, rem, Flex, Text, ActionIcon, Box, TextInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconX, IconSend } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState } from "react";

import { PhoneNumberInput } from "../PhoneNumberInput";
import { TicketCard } from "../TicketCard";

export const TicketListItem = ({
  ticket,
  isMobile,
  purchase,
  refetch,
}: {
  ticket: IPurchaseTicket;
  purchase: IPurchase;
  isMobile: boolean;
  refetch: () => void;
}) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const [opened, { open, close }] = useDisclosure(false);
  const [sendOpened, { open: sendOpen, close: sendClose }] = useDisclosure(false);

  const [countryCode, setCountryCode] = useState<string>("1");

  const { date, weekday, startTime, endTime } = getEventDateTimeInfo(
    purchase.ticket_tier.start_at,
    purchase.ticket_tier.end_at,
    purchase.event.time_zone.utc_offset
  );

  const currentUser = userStore((state) => state.currentUser);

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
    },
    validate: {
      first_name: (value) => (value.length < 2 ? "First Name must have at least 2 letters" : null),
      last_name: (value) => (value.length < 2 ? "Last Name must have at least 2 letters" : null),
      email: (value) => (emailRegex.test(value) ? null : "Invalid email"),
    },
  });

  const { mutate: handleSendTicket, isLoading: sendTicketLoading } = useMutation(
    (formValues: Partial<IPurchaseTicket>) =>
      sendTicket({
        purchaseId: purchase.id,
        id: ticket.id,
        values: {
          ...formValues,
          phone_number: formValues.phone_number
            ? `${countryCode}-${formValues.phone_number}`
            : null,
        },
      }).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: () => {
        refetch();

        successNotification({
          title: "Successful",
          message: "Ticket was sent successfully",
        });

        sendClose();
      },
    }
  );

  return (
    <Flex
      bg={"#25262b"}
      h={rem(58)}
      align={"center"}
      sx={{
        borderBottom: "1px solid #373a3f",
      }}
    >
      <Text fw={400} ml={rem(90)} w={"23.5%"}>
        {ticket.first_name
          ? `${ticket.first_name} ${ticket.last_name}`
          : `${currentUser?.data?.first_name} ${currentUser?.data?.last_name}`}
      </Text>

      <Text fw={400} w={"46%"}>
        {ticket.email || currentUser?.data?.email}
      </Text>
      <Flex gap={rem(20)} align={"center"}>
        <ActionIcon size={rem(28)} onClick={() => open()}>
          <IconEye size={rem(28)} stroke={1.5} color="#FFFFFFCC" />
        </ActionIcon>
        {!ticket.email && (
          <ActionIcon size={rem(28)} onClick={() => sendOpen()}>
            <IconSend size={rem(28)} stroke={1.5} color="#FFFFFFCC" />
          </ActionIcon>
        )}
      </Flex>

      <Modal
        title="Send the Ticket"
        centered={true}
        withCloseButton={false}
        size={isMobile ? rem(336) : rem(406)}
        styles={{
          content: {
            width: 306,
            padding: "25px",
            backgroundColor: "rgba(40, 43, 61, 1)",

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
        opened={sendOpened}
        onClose={sendClose}
        keepMounted={false}
      >
        <form onSubmit={form.onSubmit((values) => handleSendTicket(values))}>
          <TextInput
            withAsterisk
            label="First Name"
            mt={rem(12)}
            {...form.getInputProps("first_name")}
          />

          <TextInput
            withAsterisk
            label="Last Name"
            mt={rem(12)}
            {...form.getInputProps("last_name")}
          />

          <TextInput withAsterisk label="Email" mt={rem(12)} {...form.getInputProps("email")} />
          <Flex direction={"column"} mt={rem(12)}>
            <PhoneNumberInput
              label="Phone Number"
              withAsterisk={false}
              placeholder="(506) 234-5678"
              inputProps={{ ...form.getInputProps("mobile") }}
              setCountryCode={setCountryCode}
            />
          </Flex>

          <Group position="center" mt={rem(35)} spacing={rem(25)}>
            <Button variant="outline" onClick={sendClose} fw={300} h={44}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "#3077F3", to: "#15AABF" }}
              fw={300}
              h={44}
              disabled={!form.isDirty()}
              loading={sendTicketLoading}
            >
              Send the Ticket
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal
        styles={() => ({
          content: {
            background: "transparent",
            height: rem(650),
          },
          header: {
            background: "transparent",
            maxWidth: 324,
            margin: "auto",
            paddingRight: 0,
            paddingLeft: 0,
          },
          body: {
            padding: isMobile ? 0 : undefined,
          },
        })}
        bg={"transparent"}
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        transitionProps={{ duration: 200 }}
      >
        <Flex align={"center"} justify={"space-between"} maw={324} mx={"auto"}>
          <Box />
          <Flex
            align="center"
            justify="end"
            gap={11}
            mb={"0.75rem"}
            onClick={() => close()}
            sx={{ cursor: "pointer" }}
          >
            <Text weight={300} lh="1.25rem" size="1rem" color="#ffffff">
              Close
            </Text>
            <IconX color="#ffffff" size="1rem" />
          </Flex>
        </Flex>
        <Flex w={"100%"} justify={"center"}>
          <TicketCard
            type="long"
            qrCode={ticket.code}
            currency={process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"}
            thumbnail={purchase.event.primary_image}
            title={purchase.event.name}
            cadPrice={purchase.ticket_tier.price}
            date={`${weekday}, ${date}`}
            time={`${startTime} - ${endTime} ${purchase.event.time_zone.abbr}`}
            location={`${purchase.event.address}, ${purchase.event.city}, ${purchase.event.province_state}, ${purchase.event.country}`}
            tier={purchase.ticket_tier.name}
          />
        </Flex>
      </Modal>
    </Flex>
  );
};
