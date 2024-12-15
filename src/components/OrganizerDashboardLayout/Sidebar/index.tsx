import { userLogout } from "@/api/handler/auth";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { createStyles, Flex, Navbar, NavLink, rem, Stack, useMantineTheme } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconLogout } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";

import {
  operatorNavbarItems,
  organizerNavbarItems,
  adminNavbarItems,
  INavbarItem,
  promoterNavbarItems,
} from "@/components/OrganizerDashboardLayout/Sidebar/constant";

import PrimaryLogo from "../svg/primary_logo_white.svg";

const useStyles = createStyles(() => ({
  wrapper: {
    "& .mantine-Navbar-root": {
      top: 0,
      height: "100vh",
      transition: "width 300ms",
    },
  },
}));

type NavbarProps = {
  collapsed: boolean;
  role?: UserType;
  setCollapsed: (value: boolean) => void;
};

const navbarItems: { [key in UserType]?: INavbarItem[] } = {
  [UserType.Organizer]: organizerNavbarItems,
  [UserType.Operator]: operatorNavbarItems,
  [UserType.Admin]: adminNavbarItems,
  [UserType.Promoter]: promoterNavbarItems,
};

const logoutVariants: { [key in UserType]?: string } = {
  [UserType.Organizer]: "organization",
  [UserType.Operator]: "organization",
  [UserType.Admin]: "admin",
  [UserType.Promoter]: "promoter",
};

const Sidebar: FC<NavbarProps> = ({ collapsed, setCollapsed, role = UserType.Organizer }) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const navbarItemsArray = navbarItems[role] as INavbarItem[];

  const logout = userStore((state: IUserStore) => state.logout);
  const onLogout = () =>
    userLogout({ variant: logoutVariants[role] as string }).then(() => logout());

  const { classes } = useStyles();

  return (
    <Stack className={classes.wrapper}>
      <Navbar
        fixed
        width={{ base: collapsed ? 54 : 365 }}
        bg={"#1E2130"}
        px={!collapsed ? rem(20) : undefined}
      >
        {!collapsed && (
          <Flex justify="space-between" p="lg" sx={{ cursor: "pointer" }}>
            <Image src={PrimaryLogo} alt="primary logo" onClick={() => router.push("/")} />
            <IconArrowLeft onClick={() => setCollapsed(true)} />
          </Flex>
        )}

        <Navbar.Section grow mt={!collapsed ? rem(20) : undefined}>
          <Stack justify="center" spacing={0} px={rem(5)}>
            {collapsed && (
              <NavLink
                icon={<IconArrowRight color="#FFFFFFCC" />}
                onClick={() => setCollapsed(false)}
                mt={rem(22)}
              />
            )}
            {navbarItemsArray.map((link) => (
              <NavLink
                icon={<link.icon color={theme.colors.indigo[4]} />}
                key={link.label}
                active={router.pathname === link.link || link?.subLinks?.includes(router.route)}
                component="a"
                href={link.link}
                label={collapsed ? null : link.label}
                w={collapsed ? rem(44) : undefined}
                h={collapsed ? rem(44) : undefined}
                styles={
                  collapsed
                    ? {
                        icon: {
                          margin: 0,
                        },
                        root: {
                          display: "flex",
                          justifyContent: "center",
                          borderRadius: 4,
                          "&[data-active]": {
                            backgroundColor: "#1A1B1E",
                          },
                        },
                      }
                    : {
                        root: {
                          borderRadius: 4,
                          "&[data-active]": {
                            backgroundColor: "#1A1B1E",
                            "& .mantine-NavLink-label": {
                              color: "#7791F9",
                            },
                          },
                        },
                      }
                }
              />
            ))}
          </Stack>
        </Navbar.Section>
        <Navbar.Section>
          <Stack justify="center" spacing={0} px={rem(5)}>
            <NavLink
              py={!collapsed ? "md" : undefined}
              px={"sm"}
              icon={<IconLogout color={theme.colors.indigo[5]} />}
              label="Logout"
              onClick={onLogout}
              mb={rem(24)}
              w={collapsed ? rem(44) : undefined}
              h={collapsed ? rem(44) : undefined}
              styles={
                collapsed
                  ? {
                      icon: {
                        margin: 0,
                      },
                      root: {
                        display: "flex",
                        justifyContent: "center",
                      },
                    }
                  : {}
              }
            />
          </Stack>
        </Navbar.Section>
      </Navbar>
    </Stack>
  );
};

export default Sidebar;
