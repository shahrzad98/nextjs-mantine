import NoSsr from "@/common/NoSsr";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { AppShell } from "@mantine/core";
import { useRouter } from "next/router";
import React, { Children, cloneElement, FC, isValidElement } from "react";

import { INVTLayout, NVTLayout } from "@/components";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface IOrganizerDashboardLayoutProps extends INVTLayout {
  activeBreadCrumb?: string;
}

export const OrganizerDashboardLayout: FC<IOrganizerDashboardLayoutProps> = (props) => {
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const router = useRouter();

  const collapsed = userStore((state: IUserStore) => state.sidebarCollapsed);
  const setCollapsed = userStore((state: IUserStore) => state.toggleSidebar);

  const { isTablet } = useBreakpoint();

  const childrenWithProps = Children.map(props.children, (child) => {
    if (isValidElement<{ collapsed: boolean }>(child)) {
      return cloneElement(child, { collapsed });
    }

    return child;
  });

  if (currentUser?.role === UserType.Promoter && !currentUser?.data?.username) {
    router.push("/promoter/auth/onboarding/setup");
  }

  return isTablet ? (
    <NVTLayout backgroundGradientVariant={13} {...props}>
      {props.children}
    </NVTLayout>
  ) : (
    <NoSsr>
      <AppShell
        navbarOffsetBreakpoint="md"
        navbar={
          <Sidebar role={currentUser?.role} collapsed={collapsed} setCollapsed={setCollapsed} />
        }
        header={
          <Navbar
            collapsed={collapsed}
            role={currentUser?.role}
            currentBreadcrumb={props.activeBreadCrumb}
          />
        }
        padding={0}
      >
        {childrenWithProps}
      </AppShell>
    </NoSsr>
  );
};
