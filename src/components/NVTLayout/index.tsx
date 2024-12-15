import NoSsr from "@/common/NoSsr";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { AppShell, AppShellProps } from "@mantine/core";
import { ReactNode } from "react";

import { BackgroundGradients } from "@/components";

import { Footer } from "../Footer";
import { IFooter } from "../Footer/types";
import { Navbar } from "../Navbar";
import { INavbarOptional, NavbarVariant } from "../Navbar/types";
import { getLayoutData } from "./helpers/getLayoutData";

export interface INVTLayout extends AppShellProps {
  hasNavbar?: boolean;
  navbarProps?: INavbarOptional;
  hasFooter?: boolean;
  footerProps?: IFooter;
  activeLink?: string;
  children: ReactNode;
  backgroundGradientVariant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | null;
}

export const NVTLayout = ({
  hasNavbar = true,
  navbarProps,
  hasFooter = true,
  footerProps,
  activeLink = "",
  children,
  backgroundGradientVariant,
  ...props
}: INVTLayout) => {
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const token = currentUser?.token;
  const { isTablet, isMobile } = useBreakpoint();
  const userType = !token ? UserType.Guest : currentUser?.role;

  const {
    variant,
    links: { desktopLinks, mobileLinks },
    footerGroups,
  } = getLayoutData(userType as UserType | null);
  const tabletFooterGroups = footerGroups.slice();
  [tabletFooterGroups[0], tabletFooterGroups[2]] = [tabletFooterGroups[2], tabletFooterGroups[0]];

  const defaultNavbarHeight = isTablet ? 58 : 78;

  const confirmationBannerHeight =
    variant !== NavbarVariant.Attendee || currentUser?.data?.email_confirmed_at
      ? 0
      : isMobile && navbarProps?.emailConfirmationBanner === "default"
      ? 40
      : isMobile
      ? 35
      : navbarProps?.emailConfirmationBanner === "default"
      ? 50
      : 42;

  const finalNavbarHeight = defaultNavbarHeight + confirmationBannerHeight;

  return (
    <NoSsr>
      <AppShell
        fixed={false}
        header={
          hasNavbar ? (
            <Navbar
              variant={variant}
              height={defaultNavbarHeight}
              containerHeight={finalNavbarHeight}
              sticky={true}
              background={isMobile ? "none" : "filled"}
              links={desktopLinks}
              mobileLinks={mobileLinks}
              activeLink={activeLink}
              {...navbarProps}
            />
          ) : undefined
        }
        footer={
          hasFooter ? (
            <Footer
              activeLink={activeLink}
              groups={isTablet ? tabletFooterGroups : footerGroups}
              {...footerProps}
            />
          ) : undefined
        }
        padding={0}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          root: {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
          ".mantine-AppShell-body": {
            flex: 1,
            position: "relative",
          },
        })}
        {...props}
      >
        {backgroundGradientVariant && (
          <BackgroundGradients variant={backgroundGradientVariant} top={-finalNavbarHeight} />
        )}
        {children}
      </AppShell>
    </NoSsr>
  );
};
