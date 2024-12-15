import { useBreakpoint } from "@/hooks";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  Group,
  Menu,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { IconDotsVertical, IconEye, IconPencil } from "@tabler/icons-react";

import { AppImage } from "@/components";

import { useStyles } from "./assets/useStyles";
import { getBadgeColor } from "./helpers/getBadgeColor";

export interface IOrganizerEventCard {
  image: string;
  status: "draft" | "published" | "canceled" | "rescheduled" | "done" | string;
  date: string;
  time: string;
  title: string;
  address: string;
  isBefore: boolean;
  is_private: boolean;
  onEdit: () => void;
  onView: () => void;
}

export const OrganizerEventCard = ({
  image,
  status,
  date,
  time,
  title,
  address,
  onEdit,
  onView,
  isBefore,
  is_private,
}: IOrganizerEventCard) => {
  const { classes } = useStyles();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

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
            <Flex direction={"row"} gap={"10px"}>
              <Badge
                size={!isDesktop && !isMobile ? "sm" : "xl"}
                radius="xs"
                variant="filled"
                px={8}
                py={5}
                sx={(theme) => ({
                  background: getBadgeColor(status) || theme.colors.nvtPrimary[2],
                })}
                className={classes.badge}
              >
                {status}
              </Badge>
              {is_private ? (
                <Badge
                  size={!isDesktop && !isMobile ? "sm" : "xl"}
                  radius="xs"
                  variant="gradient"
                  gradient={{ from: "#3077F3", to: "#88009E", deg: 107 }}
                  sx={{
                    textTransform: "capitalize",
                  }}
                  px={8}
                  py={5}
                  className={classes.badge}
                >
                  {"Private"}
                </Badge>
              ) : null}
            </Flex>
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon>
                  <IconDotsVertical color="rgba(255, 255, 255, 0.50)" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown
                sx={(theme) => ({
                  background: theme.colors.nvtPrimary[4],
                  borderColor: theme.colors.nvtPrimary[7],
                  "& *": {
                    borderColor: theme.colors.nvtPrimary[7],
                  },
                })}
              >
                {!isBefore && status !== "done" && status !== "canceled" && (
                  <>
                    <Menu.Item
                      className={classes.dropdownItem}
                      icon={<IconPencil size={24} />}
                      onClick={onEdit}
                    >
                      Edit
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
            size="xs"
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
