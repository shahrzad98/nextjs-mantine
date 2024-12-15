import { useBreakpoint } from "@/hooks";
import { IOrganization, ITimezone } from "@/types";
import { getEventDateTimeInfo, kFormatter } from "@/utils";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Group,
  rem,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/router";

import { AppImage } from "@/components";

export interface IHomeEventCardProps {
  variant?: "xs" | "sm" | "lg";
  primary_image: string | null;
  available_tickets: number | null;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  province_state: string | null;
  organization?: Partial<IOrganization>;
  onClick?: () => void;
  start_at: string | null;
  end_at: string | null;
  time_zone: Partial<ITimezone>;
}

export const HomeEventCard = ({
  variant = "lg",
  primary_image,
  name,
  available_tickets,
  start_at,
  end_at,
  time_zone,
  address,
  city,
  province_state,
  country,
  organization,
  onClick,
}: IHomeEventCardProps) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const fullAddress = `${address ? address + ", " : ""}${city ? city + ", " : ""}${
    province_state ? province_state + ", " : ""
  }${country ?? ""}`;

  const { startTime, endTime, date, weekday, isBefore } = getEventDateTimeInfo(
    start_at as string,
    end_at as string,
    time_zone.utc_offset
  );
  const theme = useMantineTheme();

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {variant === "xs" && (
        <Card
          px={15}
          py={10}
          mb={12}
          sx={{
            width: "100%",
            border: "1px solid #373A3F;",
            cursor: "pointer",
          }}
          onClick={onClick}
        >
          <Text color="#FFFFFFB2" fz={rem(14)} fw={400} lineClamp={1} lh="155%">
            {name}
          </Text>
          <Text color="#E981FA" fz={rem(10)} fw={400} mt={8} lineClamp={1} lh="normal">
            {weekday}, {date}, {startTime} {time_zone?.abbr}
          </Text>
          <Text lineClamp={1} fz={rem(10)} fw={400} mt={8} lh="normal">
            {fullAddress}
          </Text>
        </Card>
      )}

      {variant === "sm" && (
        <Card
          p={0}
          mb={isMobile ? 4 : 16}
          sx={{
            width: rem(330),
            height: rem(138),
            border: "1px solid #373A3F",
            cursor: "pointer",
          }}
          onClick={onClick}
          mr={0}
        >
          <Flex>
            <Box w={113} sx={{ img: { objectFit: primary_image ? "cover" : "unset" } }}>
              <AppImage src={primary_image as string} alt={name} wrapperHeight={138} fill />
            </Box>
            <Box mx={18} mt={13} mb={18} w={181}>
              <Flex direction="column">
                <Flex justify="space-between">
                  <Text fz={rem(10)} fw={400} color={theme.colors.gray[5]}>
                    {available_tickets === null
                      ? "Tickets Available"
                      : isBefore
                      ? "0 tickets left"
                      : `${kFormatter(available_tickets)} ${available_tickets >= 1000 ? "+" : ""} ${
                          available_tickets === 1 ? "ticket" : "tickets"
                        } left`}
                  </Text>
                  <Flex direction="row" gap={rem(5)}>
                    <Text color={theme.colors.blue[8]} fz={rem(10)}>
                      Find Tickets
                    </Text>
                    <IconArrowRight color={theme.colors.blue[8]} size={18} />
                  </Flex>
                </Flex>
                <Text
                  color={theme.colors.gray[3]}
                  fz={rem(16)}
                  lh={rem(25)}
                  h={rem(50)}
                  fw={500}
                  lineClamp={2}
                >
                  {name}
                </Text>
              </Flex>

              <Text color={theme.colors.grape[3]} fz={rem(10)} mt={rem(8)}>
                {weekday}, {date}, {startTime} {time_zone?.abbr}
              </Text>
              <Space h={rem(6)} />
              <Text lineClamp={1} fz={rem(10)} fw={400} color={theme.colors.gray[5]}>
                {fullAddress}
              </Text>
            </Box>
          </Flex>
        </Card>
      )}

      {variant === "lg" && (
        <Card sx={{ width: rem(324) }}>
          <Card.Section>
            <Box sx={{ img: { objectFit: primary_image ? "cover" : "unset" } }}>
              <AppImage src={primary_image as string} alt={name} height={196} width={324} />
            </Box>
          </Card.Section>
          <Flex direction={"column"} mt={16.5}>
            <Group position="left">
              <Text fz={rem(10)} lh={1} h={rem(15)} color={theme.colors.gray[5]} weight="400">
                {available_tickets === null
                  ? "Tickets Available"
                  : isBefore
                  ? "0 tickets left"
                  : `${kFormatter(available_tickets)} ${available_tickets >= 1000 ? "+" : ""} ${
                      available_tickets === 1 ? "ticket" : "tickets"
                    } left`}
              </Text>
            </Group>
            <Box h={59} mb={5}>
              <Text color="white" fz={rem(24)} fw={500} lineClamp={2} sx={{ lineHeight: 1.25 }}>
                {name}
              </Text>
            </Box>
            <Flex direction={"column"}>
              <Flex direction={"row"} mb={"5px"} w="max-content">
                <Text
                  size="sm"
                  color={theme.colors.grape[3]}
                  weight="400"
                  sx={{ letterSpacing: "-0.04em" }}
                >{`${weekday}, ${date}`}</Text>
                <Text
                  size="sm"
                  color={theme.colors.grape[3]}
                  sx={{ letterSpacing: "-0.07em" }}
                  ml="0.5rem"
                >
                  {startTime} - {endTime} {time_zone?.abbr}
                </Text>
              </Flex>
              <Box h={41} mb={5}>
                <Text
                  color={theme.colors.gray[0]}
                  weight="400"
                  lineClamp={2}
                  size="sm"
                  lh="1.25rem"
                  mb="0.5rem"
                >
                  {fullAddress}
                </Text>
              </Box>
              <Flex
                mt={6}
                sx={{ cursor: "pointer", "& svg": { width: "100%", height: "100%" } }}
                direction="row"
                align="center"
                gap={rem(8)}
                onClick={() => router.push(`/marketplace/${organization?.slug?.toLowerCase()}`)}
              >
                <Avatar
                  sx={{ border: "none" }}
                  src={organization?.cover_photo}
                  alt={organization?.name}
                  radius="xl"
                  size="sm"
                />
                <Text
                  fz={rem(10)}
                  weight="300"
                  sx={{ letterSpacing: "-0.2" }}
                  color={theme.colors.gray[5]}
                >
                  {organization?.name}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Space h={rem(25)} />
          <Button
            h={rem(44)}
            variant="gradient"
            gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
            fullWidth
            sx={{ cursor: "pointer" }}
            onClick={onClick}
          >
            <Text weight="400">Find Tickets</Text>
          </Button>
        </Card>
      )}
    </Box>
  );
};
