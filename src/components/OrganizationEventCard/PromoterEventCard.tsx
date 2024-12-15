import { useBreakpoint } from "@/hooks";
import { successNotification } from "@/utils";
import { ActionIcon, Badge, Box, Card, Grid, Group, Menu, rem, Text, Title } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconDotsVertical, IconEye } from "@tabler/icons-react";
import Image from "next/image";

import { AppImage } from "@/components";

import ChainSvg from "./assets/chain-icon.svg";
import { useStyles } from "./assets/useStyles";
import { getBadgeColor } from "./helpers/getBadgeColor";

const ChainIcon = () => (
  <Image src={ChainSvg} alt="copy" style={{ width: rem(24), height: rem(24) }} />
);

export interface IPromoterEventCard {
  image: string;
  status: "draft" | "published" | "canceled" | "rescheduled" | "done" | string;
  date: string;
  time: string;
  title: string;
  slug: string;
  address: string;
  isBefore: boolean;
  promoterName: string;
  onView: () => void;
}

export const PromoterEventCard = ({
  image,
  status,
  date,
  time,
  title,
  address,
  slug,
  onView,
  isBefore,
  promoterName,
}: IPromoterEventCard) => {
  const { classes } = useStyles();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const clipboard = useClipboard({ timeout: 500 });

  return (
    <Card shadow="sm" p={0} radius="sm">
      <Grid p={0}>
        <Grid.Col span={4} md={12}>
          <Box className={classes.image} sx={{ img: { objectFit: image ? "cover" : "unset" } }}>
            <AppImage src={image} alt={title} wrapperHeight={isMobile ? 178 : 196} fill />
          </Box>
        </Grid.Col>
        <Grid.Col span={8} md={12} p="lg">
          <Group position="apart">
            <Badge
              size={!isDesktop && !isMobile ? "sm" : "xl"}
              radius="xs"
              variant="filled"
              p="sm"
              sx={(theme) => ({ background: getBadgeColor(status) || theme.colors.nvtPrimary[2] })}
              className={classes.badge}
            >
              {status}
            </Badge>
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon>
                  <IconDotsVertical color="rgba(255, 255, 255, 0.50)" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {!isBefore && status !== "done" && status !== "canceled" && (
                  <>
                    <Menu.Item
                      className={classes.dropdownItem}
                      icon={<ChainIcon />}
                      onClick={() => {
                        clipboard.copy(
                          `${window.location.protocol}//${window.location.host}/event/${slug}?promoter=${promoterName}`
                        );
                        successNotification({
                          title: "SUCCESS!",
                          message: "Link was successfully copied to your clipboard",
                        });
                      }}
                    >
                      Copy Link
                    </Menu.Item>
                    <Menu.Divider />
                  </>
                )}
                <Menu.Item
                  className={classes.dropdownItem}
                  icon={<IconEye size={24} />}
                  onClick={onView}
                >
                  {status === "draft" ? "Preview" : "View"}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Text
            size="sm"
            color="dimmed"
            mt={rem(16)}
            className={classes.desktopDateTime}
            lineClamp={1}
          >
            {date} | {time}
          </Text>
          <Box h={isTablet ? "unset" : 59} mb={isTablet ? 0 : 15}>
            <Title
              order={2}
              lineClamp={2}
              weight={500}
              mt={{ base: rem(8), md: rem(4) }}
              className={classes.title}
            >
              {title}
            </Title>
          </Box>
          <Text
            size={rem(isMobile ? 10 : 14)}
            color="dimmed"
            mt={rem(8)}
            className={classes.mobileDateTime}
          >
            {date}
          </Text>
          <Text
            size={rem(isMobile ? 10 : 14)}
            color="dimmed"
            mt={rem(8)}
            className={classes.mobileDateTime}
          >
            {time}
          </Text>
          <Text
            size={rem(isMobile ? 10 : 14)}
            color="dimmed"
            lineClamp={1}
            mt={{ base: rem(8), md: rem(4) }}
            sx={(theme) => ({
              [theme.fn.largerThan("md")]: {
                height: 1.55 * 14 * 2,
                WebkitLineClamp: 2,
              },
            })}
          >
            {address}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
