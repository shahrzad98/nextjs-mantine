import { userLogout } from "@/api/handler/auth";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import {
  Header,
  Container,
  Group,
  Burger,
  Transition,
  rem,
  Autocomplete,
  Button,
  Paper,
  Stack,
  Box,
  Flex,
  Modal,
  useMantineTheme,
  Space,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconLogout, IconSearch, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { HomeSearch } from "@/components";

import LogoAlt from "./assets/logo-alt.svg";
import Logo from "./assets/logo.svg";
import { useStyles } from "./assets/useStyles";
import { EmailConfirmationBanner } from "./EmailConfirmationBanner";
import { LinkSet } from "./LinkSet";
import { INavbar, NavbarVariant } from "./types";

const logoutVariants: { [key in UserType]?: string } = {
  [UserType.Attendee]: "attendee",
  [UserType.Organizer]: "organization",
  [UserType.Operator]: "organization",
  [UserType.Admin]: "admin",
  [UserType.Promoter]: "promoter",
};

const loginVariants: { [key in UserType]?: string } = {
  [UserType.Organizer]: "organization",
  [UserType.Operator]: "operator",
  [UserType.Admin]: "admin",
  [UserType.Promoter]: "promoter",
};

export const Navbar = ({
  variant = NavbarVariant.Guest,
  height = 78,
  containerHeight = 78,
  links = [],
  mobileLinks = [],
  activeLink = "",
  background = "none",
  sticky = false,
  currentPageTitle = "",
  rightSideActions,
  handleBackButton,
  emailConfirmationBanner = "default",
}: INavbar) => {
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);

  const [scrolled, setScrolled] = useState(false);

  const userData = userStore((state: IUserStore) => state.currentUser);
  const currentUser = userData?.data;
  const logout = userStore((state: IUserStore) => state.logout);
  const { isMobile, isTablet } = useBreakpoint();

  const [searchValue, setSearchValue] = useState<string>("");
  const [menuOpened, { toggle: toggleMenu }] = useDisclosure(false);

  const theme = useMantineTheme();

  const { classes, cx } = useStyles();

  const onLogout = () =>
    userLogout({ variant: logoutVariants[userData?.role as UserType] as string }).then(() => {
      const role = loginVariants[userData?.role as UserType];
      logout();
      localStorage.removeItem("nvt-user-storage");
      if (role) {
        router.push(`/${role}/auth/login`);
      } else {
        router.push("/auth/login");
      }
    });

  const changeNavbarColor = useCallback(() => {
    if (window.scrollY >= containerHeight && sticky) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, [sticky]);

  useEffect(() => {
    window.addEventListener("scroll", changeNavbarColor);

    return () => {
      window.removeEventListener("scroll", changeNavbarColor);
    };
  }, [changeNavbarColor]);

  const handleRegister = () => {
    router.push("/auth/signup");
  };

  const handleBack = () => {
    if (handleBackButton) {
      handleBackButton();
    } else {
      router.back();
    }
  };

  return (
    <Box
      h={variant === NavbarVariant.Basic && isMobile ? rem(46) : rem(containerHeight)}
      mih={variant === NavbarVariant.Basic && isMobile ? rem(46) : rem(containerHeight)}
      mah={variant === NavbarVariant.Basic && isMobile ? rem(46) : rem(containerHeight)}
    >
      <Header
        height={variant === NavbarVariant.Basic && isMobile ? rem(46) : rem(height)}
        className={cx(classes.root, {
          [classes.filled]: background === "filled",
          [classes.sticky]: scrolled,
        })}
        mih={variant === NavbarVariant.Basic && isMobile ? rem(46) : rem(height)}
      >
        {variant === NavbarVariant.Basic ? (
          <Group align="center" position="center" h={18}>
            <Link href={"/"}>
              <Image src={Logo} alt="NovelT Logo" height={18} />
            </Link>
          </Group>
        ) : (
          <Container className={classes.navbar} fluid>
            <Group noWrap>
              <Link href="/">
                <Image src={Logo} alt="NovelT Logo" />
              </Link>
              {isMobile ? (
                <IconSearch
                  size="24px"
                  stroke={2}
                  onClick={open}
                  cursor="pointer"
                  pointerEvents="all"
                  color={
                    router?.route?.startsWith(`/events/search`)
                      ? theme.colors.nvtPrimary[2]
                      : "rgba(255,255,255,.5)"
                  }
                />
              ) : (
                <Autocomplete
                  className={classes.search}
                  variant="filled"
                  placeholder="Search Events"
                  onKeyDown={(e) => e.key === "Enter" && open()}
                  icon={
                    <IconSearch
                      size="24px"
                      stroke={2}
                      onClick={open}
                      cursor="pointer"
                      pointerEvents="all"
                    />
                  }
                  rightSection={
                    searchValue ? (
                      <ActionIcon variant="transparent" onClick={() => setSearchValue("")}>
                        <IconX
                          color="rgba(255, 255, 255, 0.8)"
                          size={isMobile ? rem(16) : rem(24)}
                        />
                      </ActionIcon>
                    ) : null
                  }
                  data={[]}
                  value={(searchValue && decodeURIComponent(searchValue)) || ""}
                  onChange={(value) => setSearchValue(encodeURIComponent(value))}
                  sx={(theme) => ({ input: { background: theme.colors.nvtPrimary[4] } })}
                />
              )}
            </Group>
            <Group noWrap spacing={`0 ${rem(20)}`} className={classes.links}>
              <LinkSet
                linkSet={links}
                activeLink={activeLink || ""}
                isMobile={false}
                activeLinkHasBackground={background !== "filled" && !scrolled}
              />
              {variant !== NavbarVariant.Guest ? (
                <Button
                  variant="subtle"
                  leftIcon={<IconLogout />}
                  fw={400}
                  color="indigo"
                  className={classes.button}
                  onClick={onLogout}
                >
                  Log out
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  gradient={{
                    from: theme.colors.nvtPrimary[2],
                    to: theme.colors.nvtPrimary[1],
                    deg: 0,
                  }}
                  fw={600}
                  px={20}
                  className={classes.button}
                  onClick={handleRegister}
                >
                  Sign In / Sign Up
                </Button>
              )}
            </Group>

            <Burger opened={menuOpened} onClick={toggleMenu} className={classes.burger} size="md" />
          </Container>
        )}

        <Modal
          opened={opened}
          onClose={close}
          fullScreen
          title={
            <Link href="/" onClick={close}>
              <Image src={Logo} alt="NovelT Logo" />
            </Link>
          }
          sx={{
            "& .mantine-Modal-content, .mantine-Modal-header": {
              background: theme.colors.nvtPrimary[5],
            },
            ".mantine-Modal-header": { zIndex: 1 },
          }}
        >
          <Container size={!isMobile ? rem(1042) : "xs"} p={!isMobile ? "1rem" : rem(11)}>
            {router.isReady && (
              <>
                {!router.pathname.includes("/organization") &&
                !router.pathname.includes("/operator") ? (
                  <Flex
                    mih={isMobile ? rem(150) : rem(175)}
                    justify="center"
                    direction="column"
                    px={!isMobile ? "1rem" : 0}
                  >
                    {router.isReady && (
                      <HomeSearch
                        closeModal={() => close()}
                        defaultQuery={searchValue || ""}
                        isNavbarSearch
                      />
                    )}
                  </Flex>
                ) : (
                  <Flex
                    pt={rem(15)}
                    justify="center"
                    direction="column"
                    px={!isMobile ? "1rem" : 0}
                  >
                    <HomeSearch closeModal={() => close()} isNavbarSearch />
                  </Flex>
                )}
              </>
            )}
          </Container>
        </Modal>
      </Header>
      {variant === NavbarVariant.Attendee && !currentUser?.email_confirmed_at && (
        <EmailConfirmationBanner variant={emailConfirmationBanner} />
      )}
      {(currentPageTitle || rightSideActions) && isTablet && (
        <Flex
          justify={currentPageTitle ? "space-between" : "flex-end"}
          py={rem(12)}
          px={rem(16)}
          className={cx(classes.root, {
            [classes.filled]: background === "filled" || scrolled,
          })}
        >
          {currentPageTitle && (
            <Button
              className={classes.back}
              leftIcon={<IconArrowLeft />}
              size="md"
              h="auto"
              p={0}
              onClick={handleBack}
              styles={{
                leftIcon: {
                  marginRight: rem(25),
                },
              }}
            >
              {currentPageTitle}
            </Button>
          )}
          {rightSideActions}
        </Flex>
      )}
      <Transition transition="slide-right" duration={200} mounted={menuOpened}>
        {(styles) => (
          <Paper
            className={classes.dropdown}
            withBorder
            style={styles}
            sx={{ overflowY: "scroll" }}
          >
            <Stack justify="space-between" h="100%">
              <Box>
                <Group align="flex-start" position="apart" mb={rem(10)}>
                  <Image src={LogoAlt} alt="NovelT Logo" />
                  <Burger opened={menuOpened} onClick={toggleMenu} size="md" />
                </Group>
                <LinkSet
                  linkSet={mobileLinks}
                  activeLink={activeLink || ""}
                  isMobile={true}
                  activeLinkHasBackground={background !== "filled" && !scrolled}
                />
              </Box>
              {variant !== NavbarVariant.Guest && (
                <Box pb={10} pt={0}>
                  <Button
                    variant="subtle"
                    color="indigo"
                    leftIcon={<IconLogout />}
                    className={classes.button}
                    onClick={onLogout}
                    sx={{ display: "flex", justifyContent: "flex-start", padding: "0 1rem" }}
                    fw={400}
                  >
                    Log out
                  </Button>
                </Box>
              )}
            </Stack>
            <Space h={rem(60)} />
          </Paper>
        )}
      </Transition>
    </Box>
  );
};
