import { useBreakpoint } from "@/hooks";
import { Box, Card, Grid, rem, Text, Title } from "@mantine/core";

import { AppImage } from "@/components";

import { useStyles } from "./assets/useStyles";

interface IOperatorEventCard {
  id: string;
  ticketsLeft: string | number;
  image: string;
  date: string;
  time: string;
  title: string;
  address: string;
  city: string;
  province_state: string;
  country: string;
  onClick?: () => void;
}

export const OperatorEventCard = ({
  ticketsLeft,
  image,
  date,
  time,
  title,
  address,
  city,
  country,
  province_state,
  onClick,
}: IOperatorEventCard) => {
  const { classes } = useStyles();
  const { isTablet } = useBreakpoint();
  const fullAddress = `${address ? address + ", " : ""}${city ? city + ", " : ""}${
    province_state ? province_state + ", " : ""
  }${country ?? ""}`;

  return (
    <Card
      shadow="sm"
      p={0}
      radius="sm"
      sx={{
        cursor: onClick ? "pointer" : undefined,
        "&:hover": {
          h2: {
            color: "#fff",
          },
        },
      }}
      onClick={onClick}
    >
      <Grid p={0}>
        <Grid.Col span={4} md={12} p={0}>
          <div className={classes.image}>
            <AppImage
              src={image}
              alt={title}
              sizes="100vw"
              fill
              wrapperHeight={isTablet ? undefined : 196}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={8} md={12}>
          <Box pb={rem(20)} pt={rem(isTablet ? 12 : 20)} px={rem(isTablet ? 20 : 16)}>
            <Text
              size="xs"
              color="dimmed"
              sx={(theme) => ({
                fontSize: rem(10),
                [theme.fn.largerThan("md")]: {
                  fontSize: rem(11),
                },
              })}
            >
              {ticketsLeft} {Number(ticketsLeft) === 1 ? "ticket" : "tickets"} left
            </Text>
            <Box h={isTablet ? "unset" : 59} mb={isTablet ? 0 : 15}>
              <Title
                order={3}
                fz={rem(isTablet ? 16 : 24)}
                lineClamp={isTablet ? 2 : 1}
                weight={500}
                color="#FFFFFFCC"
                mt={{ base: rem(8), md: rem(4) }}
                className={classes.title}
              >
                {title}
              </Title>
            </Box>
            <Text
              size="xs"
              mt={rem(8)}
              lineClamp={1}
              sx={(theme) => ({
                color: theme.colors.grape[4],
                fontSize: rem(10),
                [theme.fn.largerThan("md")]: {
                  fontSize: rem(14),
                },
              })}
            >
              {date} {time}
            </Text>
            <Text
              size="sm"
              color="dimmed"
              lineClamp={2}
              mt={{ base: rem(8), md: rem(4) }}
              sx={(theme) => ({
                fontSize: rem(10),
                height: rem(31),
                [theme.fn.largerThan("md")]: {
                  fontSize: rem(14),
                  height: rem(43),
                },
              })}
            >
              {fullAddress}
            </Text>
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
