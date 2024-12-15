import { useBreakpoint } from "@/hooks";
import { ExpandableText } from "@/modules";
import { EventStatus } from "@/types";
import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Group,
  rem,
  Stack,
  StackProps,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendar, IconClock, IconMapPin, IconPencil, IconQrcode } from "@tabler/icons-react";

import { getBadgeColor } from "@/components/OrganizationEventCard/helpers/getBadgeColor";

interface IEventDetailsProps extends StackProps {
  date: string;
  time: string;
  location: string;
  openQr?: () => void;
}

const EventDetails = ({ date, time, location, openQr, ...props }: IEventDetailsProps) => {
  const { isMobile } = useBreakpoint();

  return (
    <Stack spacing={rem(10)} {...props}>
      <Group
        spacing={rem(10)}
        sx={(theme) => ({ svg: { color: theme.colors.grape[4] } })}
        noWrap
        align="start"
        mb={6}
      >
        <IconCalendar />
        <Text color="gray.5" size={isMobile ? "xs" : "lg"} sx={{ whiteSpace: "nowrap" }}>
          {date}
        </Text>
      </Group>
      <Group
        spacing={rem(10)}
        sx={(theme) => ({ svg: { color: theme.colors.grape[4] } })}
        noWrap
        align="start"
        mb={6}
      >
        <IconClock />
        <Text color="gray.5" size={isMobile ? "xs" : "lg"} sx={{ whiteSpace: "nowrap" }}>
          {time}
        </Text>
      </Group>
      <Group
        spacing={rem(10)}
        sx={(theme) => ({ svg: { color: theme.colors.grape[4] } })}
        noWrap
        align="start"
        mb={6}
      >
        <IconMapPin />
        <Text color="gray.5" size={isMobile ? "xs" : "lg"} maw={270} lineClamp={2}>
          {location}
        </Text>
      </Group>
      <Flex mb={15} onClick={openQr ? openQr : undefined} sx={{ cursor: "pointer" }}>
        <IconQrcode size={25} color="#3077F3" />
        <Text size="md" color="#3077F3" ml={10}>
          Download QR Code
        </Text>
      </Flex>
    </Stack>
  );
};

interface IEventInfo {
  title: string;
  description: string;
  status: EventStatus;
  date: string;
  time: string;
  location: string;
  is_private: boolean;
  onEdit: null | (() => void);
  openQr?: () => void;
}

export const EventInfo = ({
  title,
  description,
  status,
  date,
  time,
  location,
  is_private,
  onEdit,
  openQr,
}: IEventInfo) => {
  const { isMobile } = useBreakpoint();

  return (
    <Flex
      direction={!isMobile ? "row" : "column-reverse"}
      justify="space-between"
      gap={rem(!isMobile ? 78 : 21)}
    >
      <Stack spacing={rem(!isMobile ? 63 : 20)} w="100%" maw={rem(605)}>
        <Title order={2} c="rgba(255, 255, 255, 0.80)" size={rem(isMobile ? 26 : 36)}>
          {title}
        </Title>
        {isMobile && <EventDetails date={date} time={time} location={location} openQr={openQr} />}
        <Box>
          <ExpandableText maxHeight={isMobile ? 110 : 90}>
            <Text
              color="gray.4"
              sx={{
                p: {
                  margin: 0,
                  fontSize: rem(isMobile ? 16 : 20),
                  lineHeight: rem(isMobile ? 22 : 30),
                },
                iframe: {
                  width: "100%",
                },
              }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </ExpandableText>
        </Box>
      </Stack>
      <Flex direction={isMobile ? "row" : "column"} justify="space-between" gap={rem(10)}>
        <Flex direction={"row"} gap={"24px"}>
          <Badge
            h={rem(50)}
            sx={{
              fontSize: rem(26),
              fontWeight: 500,
              span: { height: "100%", display: "flex", alignItems: "center" },
              width: "fit-content",
              height: rem(50),
            }}
            radius="xs"
            variant="filled"
            bg={getBadgeColor(status)}
          >
            {status === "published" ? "Active" : status}
          </Badge>
          {is_private ? (
            <Badge
              h={rem(50)}
              sx={{
                fontSize: rem(26),
                fontWeight: 500,
                span: { height: "100%", display: "flex", alignItems: "center" },
                width: "fit-content",
                height: rem(50),
                textTransform: "capitalize",
              }}
              radius="xs"
              variant="gradient"
              gradient={{ from: "#3077F3 -17.3%", to: "#88009E 79.31%", deg: 107 }}
            >
              {"Private"}
            </Badge>
          ) : null}
        </Flex>
        {!isMobile && (
          <EventDetails date={date} time={time} location={location} mt={rem(35)} openQr={openQr} />
        )}
        {isMobile && onEdit && (
          <ActionIcon
            variant="light"
            c="blue"
            sx={{ background: "#ffffff" }}
            w={rem(32)}
            h={rem(32)}
            onClick={onEdit}
          >
            <IconPencil />
          </ActionIcon>
        )}
      </Flex>
    </Flex>
  );
};
