import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { ITicketCount } from "@/types";
import { separateByThousands } from "@/utils";
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  createStyles,
  Divider,
  Flex,
  Group,
  Overlay,
  rem,
  Spoiler,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconMinus, IconPlus, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";

type TicketTierCardProps = {
  title: string;
  ticketsLeft: number | null;
  description: string;
  priceCAD?: number;
  priceUSD?: number;
  defaultTicketNumber?: ITicketCount;
  addLoading: boolean;
  removeLoading: boolean;
  canPurchase?: boolean;
  shouldResetOnAdd?: boolean;
  startDate: string;
  endDate: string;
  timezone: string;
  handleSubmit: () => void;
  handleAdd: () => Promise<void>;
  handleRemove: () => void;
  handleDeleteCart: () => void;
};

const useStyles = createStyles((theme) => ({
  root: {
    background: "linear-gradient(155.96deg, #2D202E -52.82%, #1F1A25 5.41%, #12151D 63.65%)",
    ".mantine-Spoiler-root": {
      "& .mantine-Text-root": {
        textDecoration: "none",
      },
    },
  },
  counterWrapper: {
    width: 40,
    height: 40,
    borderRadius: 4,
    padding: 0,
  },
  amount: {
    backgroundColor: theme.colors.blue[7],
  },
  actions: {
    backgroundColor: theme.colors.gray[9],
  },
  cursorPointer: {
    cursor: "pointer",
  },
}));
export const TicketTierCard: FC<TicketTierCardProps> = ({
  title,
  priceCAD,
  description,
  handleAdd,
  handleRemove,
  handleSubmit,
  defaultTicketNumber,
  ticketsLeft,
  handleDeleteCart,
  addLoading,
  removeLoading,
  canPurchase = false,
  shouldResetOnAdd = false,
  startDate,
  endDate,
  timezone,
}) => {
  const { isMobile } = useBreakpoint();
  const [overlayVisible, setOverlayVisible] = useState((defaultTicketNumber as number) > 0);
  const [numberOfTickets, setNumberOfTickets] = useState<ITicketCount>(defaultTicketNumber || 0);
  const currentUser = userStore((state) => state.currentUser);

  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const totalPriceCAD = (priceCAD || 0) * numberOfTickets;

  useEffect(() => {
    if ((defaultTicketNumber as number) > 0) {
      setOverlayVisible(true);
      setNumberOfTickets(defaultTicketNumber || 0);
    } else {
      setOverlayVisible(false);
    }
  }, [defaultTicketNumber]);

  async function handleIncrementTicket() {
    if ((numberOfTickets < 5 && (!ticketsLeft || ticketsLeft > 0)) || shouldResetOnAdd) {
      await handleAdd();
      setNumberOfTickets((prevState) => (prevState + 1 < 5 ? prevState + 1 : 5) as ITicketCount);
    }
  }

  function handleDecrementTicket() {
    if (numberOfTickets > 1) {
      handleRemove();
      setNumberOfTickets((prevState) => (prevState - 1 >= 0 ? prevState - 1 : 0) as ITicketCount);
    }
  }

  const numberOfDays = Math.ceil(dayjs(endDate).diff(dayjs(startDate), "hour") / 24);

  const startAt = dayjs.utc(startDate);
  const startTime = startAt.format("hh:mm A");
  const endAt = dayjs.utc(endDate);
  const endTime = endAt.format("hh:mm A");

  return (
    <Card
      w={isMobile ? "100%" : 324}
      mih={404}
      mb={isMobile ? 19 : 0}
      px="lg"
      py="xs"
      radius="md"
      withBorder
      className={classes.root}
    >
      <Flex direction="column" sx={{ placeContent: "space-between", height: "100%" }}>
        <Box>
          <Title
            order={1}
            lh={rem(38)}
            lineClamp={2}
            size={rem(32)}
            color="#FFFFFFCC"
            h="78px"
            mb="xl"
            tt={"uppercase"}
          >
            {title}
          </Title>

          <Card.Section px="lg">
            <Group position="apart" mt="md" mb="xs">
              <Flex justify="center" align="center">
                <Text size="xl" weight={400}>
                  {ticketsLeft ?? "Tickets Available"}
                </Text>
                <Text size="xs" ml={rem(5)} pos="relative" top="2px">
                  {ticketsLeft || ticketsLeft === 0
                    ? `ticket${ticketsLeft > 1 ? "s" : ""} left`
                    : ""}
                </Text>
              </Flex>
            </Group>
            <Flex direction={"column"}>
              <Flex>
                <Badge fz={rem(14)} c={"#1E2130"} bg="#E981FA" variant="filled" h={24} radius={4}>
                  {numberOfDays} Day Event
                </Badge>
              </Flex>
              <Flex align={"center"} gap={8} my={"md"}>
                <Text c={"#7791F9"} fw={700}>
                  {startTime} - {endTime} {timezone}
                </Text>
                <Divider orientation="vertical" />
                <Text c={"#7791F9"} fw={700}>
                  {dayjs(startDate).format("ddd D")}
                </Text>
              </Flex>
            </Flex>
            <Spoiler
              sx={{ textDecoration: "none" }}
              mb="xl"
              maxHeight={82}
              mih={102}
              showLabel={
                <Flex align="center">
                  <Text mr="xs" size="xs">
                    Show Ticket Details
                  </Text>
                  <IconChevronDown size={15} color={theme.colors.blue[5]} />{" "}
                </Flex>
              }
              hideLabel={
                <Flex align="center">
                  <Text mr="xs" size="xs">
                    Hide Ticket Details
                  </Text>
                  <IconChevronUp size={15} color={theme.colors.blue[5]} />
                </Flex>
              }
            >
              <Text size="sm" fw={"300"} sx={{ whiteSpace: "pre-wrap" }}>
                {description}
              </Text>
            </Spoiler>
          </Card.Section>
        </Box>
        <Box>
          <Flex justify="center" align="center" mb={rem(24)}>
            <Text size={rem(24)} weight={700}>
              $ {separateByThousands(priceCAD?.toFixed(2))}
            </Text>

            <Text size="sm" weight={500} ml="xs" color="#FFFFFFCC">
              {process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"}
            </Text>
          </Flex>
          <Box onClick={canPurchase ? undefined : handleIncrementTicket}>
            <Button
              variant="gradient"
              h={44}
              onClick={
                (ticketsLeft as number) > 0 || !ticketsLeft
                  ? () => {
                      handleIncrementTicket();
                    }
                  : undefined
              }
              disabled={ticketsLeft === 0 || !canPurchase}
              loading={addLoading || removeLoading}
              gradient={{ from: "indigo", to: "cyan", deg: 10 }}
              fullWidth
              mt="md"
              mb={18}
              radius="sm"
            >
              <Text weight={400}>{ticketsLeft === 0 ? "SOLD OUT" : "Buy Tickets"}</Text>
            </Button>
          </Box>
        </Box>
      </Flex>

      {/*Overlay*/}
      {overlayVisible && (
        <Overlay bg="rgba(24, 24, 24, 0.86)" pt="md" pb="25px" px="xs">
          <Flex
            justify="end"
            align="center"
            px="md"
            onClick={() => {
              handleDeleteCart();
              setOverlayVisible(false);
              setNumberOfTickets(0);
            }}
            className={classes.cursorPointer}
          >
            <Text size="md" weight={300} mr="xs">
              Close
            </Text>
            <IconX size={20} />
          </Flex>
          <Flex direction="column" justify="end" h={"100%"}>
            <Flex justify="center" mb="xl">
              <Button
                onClick={handleDecrementTicket}
                className={cx(classes.counterWrapper, classes.actions)}
                disabled={numberOfTickets <= 1}
                loading={removeLoading}
                styles={{
                  label: {
                    display: removeLoading ? "none" : undefined,
                  },
                  leftIcon: {
                    margin: 0,
                  },
                }}
              >
                <IconMinus />
              </Button>
              <Center className={cx(classes.counterWrapper, classes.amount)} mx="xs">
                {numberOfTickets}
              </Center>
              <Button
                onClick={handleIncrementTicket}
                className={cx(classes.counterWrapper, classes.actions)}
                disabled={numberOfTickets > 4 || ticketsLeft === 0}
                loading={addLoading}
                styles={{
                  label: {
                    display: addLoading ? "none" : undefined,
                  },
                  leftIcon: {
                    margin: 0,
                  },
                }}
              >
                <IconPlus />
              </Button>
            </Flex>
            <Center>
              <Text size="lg" mb="md">
                Total Price: $ {separateByThousands(totalPriceCAD.toFixed(2))}{" "}
                {process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"}
              </Text>
            </Center>
            <Button
              variant="gradient"
              h={44}
              mb={30}
              loading={addLoading || removeLoading}
              disabled={currentUser?.data?.role === "owner"}
              gradient={{ from: "indigo", to: "cyan", deg: 10 }}
              onClick={() => handleSubmit()}
            >
              <Text weight={400}>Continue</Text>
            </Button>
          </Flex>
        </Overlay>
      )}
      {/*Overlay*/}
    </Card>
  );
};
