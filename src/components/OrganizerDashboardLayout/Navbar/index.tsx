import { IEventPromoterDetails, IMyEvent, UserType } from "@/types";
import { eventKey, eventPromoterStatsKey } from "@/utils";
import { createStyles, Flex, Header, Input, rem } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import {
  INavbarItem,
  adminNavbarItems,
  navItem,
  operatorNavbarItems,
  organizerNavbarItems,
  promoterNavbarItems,
} from "../Sidebar/constant";
import Breadcrumbs from "./Breadcrumbs";

type HeaderProps = {
  /** Header width will change based on navbar collapse state */
  collapsed: boolean;
  role: UserType | undefined;
  currentBreadcrumb?: string;
};

const navbarItems: { [key in UserType]?: INavbarItem[] } = {
  [UserType.Organizer]: organizerNavbarItems,
  [UserType.Operator]: operatorNavbarItems,
  [UserType.Admin]: adminNavbarItems,
  [UserType.Promoter]: promoterNavbarItems,
};

const Navbar: FC<HeaderProps> = ({ collapsed, role, currentBreadcrumb }) => {
  interface IDynamicNavbarItem extends navItem {
    children?: navItem[];
    parentPath?: string;
  }

  interface IBreadcrumbItem {
    title: string;
    href: string;
  }

  const queryClient = useQueryClient();
  const router = useRouter();

  const { query } = router.query;

  const eventData = queryClient.getQueryData<IMyEvent>([eventKey(router.query.id as string)]);
  const eventPromoterData = queryClient.getQueryData<IEventPromoterDetails>([
    eventPromoterStatsKey,
  ]);

  const dynamicNavbarItems: IDynamicNavbarItem[] = [
    {
      label: "Create New Event",
      link: "/organization/create-event/basic-info",
      parentPath: "/organization/create-event/[id]/ticket-tiers",
      children: [
        {
          label: "Create Ticket Tiers",
          link: "/organization/create-event/[id]/ticket-tiers",
        },
      ],
    },
  ];

  const isOperator = role === UserType.Operator;
  const isAdmin = role === UserType.Admin;
  const isOrganizer = role === UserType.Organizer;
  const isPromoter = role === UserType.Promoter;

  const useStyle = createStyles(() => ({
    wrapper: {
      left: collapsed ? "54px" : "365px",
      paddingRight: `${rem(50)} !important`,
      transition: "left 300ms",
      backgroundColor: "#2F3348",
    },
  }));
  const { classes } = useStyle();
  const [keyword, setKeyword] = useState<string | null>(null);
  const adminBreadcrumb = currentBreadcrumb
    ? [
        { title: "Dashboard", href: "/admin" },
        {
          title: currentBreadcrumb as string,
          href: "/" as string,
        },
      ]
    : [{ title: "Dashboard", href: "/admin" }];

  const promoterBreadcrumb = currentBreadcrumb
    ? [
        { title: "Dashboard", href: "/promoter" },
        {
          title: currentBreadcrumb as string,
          href: "/" as string,
        },
      ]
    : [{ title: "Dashboard", href: "/promoter" }];

  const operatorBreadcrumb = currentBreadcrumb
    ? [
        { title: "Dashboard", href: "/operator" },
        {
          title: currentBreadcrumb as string,
          href: "/" as string,
        },
      ]
    : [{ title: "Dashboard", href: "/operator" }];

  const navbarItemsArray = navbarItems[role as UserType] as INavbarItem[];
  const activeBreadcrumb = navbarItemsArray.find(
    (item) => item.link === router.route && item.link !== "/organization"
  );

  const defaultBreadcrumbs: { [key in UserType]?: IBreadcrumbItem[] } = {
    [UserType.Organizer]: [{ title: "Dashboard", href: "/organization" }],
    [UserType.Operator]: operatorBreadcrumb,
    [UserType.Admin]: adminBreadcrumb,
    [UserType.Promoter]: promoterBreadcrumb,
  };

  const [breadcrumbItems, setBreadcrumbItems] = useState(
    defaultBreadcrumbs[role as UserType] as IBreadcrumbItem[]
  );
  useEffect(() => {
    const dynamicBreadCrumbs: IBreadcrumbItem[] = [];

    if (
      router.route.includes("basic-info") ||
      router.route.includes("organization/event") ||
      router.route.includes("organization/create-event")
    ) {
      dynamicBreadCrumbs.push({
        title: "My Events",
        href: "/organization/my-events",
      });
    }
    if (router.route.includes("/organization/ticket-inspector/[id]")) {
      dynamicBreadCrumbs.push({
        title: "Ticket Inspector",
        href: "/organization/ticket-inspector",
      });
    }
    if (
      router.route.includes("/organization/event/[id]") &&
      !router.pathname.includes("/promoter")
    ) {
      dynamicBreadCrumbs.push({
        title: `${eventData?.name}  (${eventData?.status.toUpperCase()})`,
        href: "/organization/my-events",
      });
    }
    if (router.route.includes("/organization/event/[id]/promoter/[promoterId]")) {
      dynamicBreadCrumbs.push({
        title: `${eventPromoterData?.event_name}`,
        href: `/organization/event/${router.query.id}`,
      });
      dynamicBreadCrumbs.push({
        title: "Promoters",
        href: "/organization/promoters",
      });
      dynamicBreadCrumbs.push({
        title: `${eventPromoterData?.promoter_name}`,
        href: "/organization/promoters",
      });
    }
    if (router.route.includes("/organization/ticket-inspector/[id]")) {
      dynamicBreadCrumbs.push({
        title: `${eventData?.name}  (${eventData?.status.toUpperCase()})`,
        href: "/organization/ticket-inspector",
      });
    }

    if (router.route.includes("/promoter/event/[id]")) {
      dynamicBreadCrumbs.push({
        title: `Event`,
        href: "/promoter/events",
      });
    }
    dynamicNavbarItems.forEach((el) => {
      if (el.children && router.route === el.parentPath) {
        dynamicBreadCrumbs.push({
          title: el.label,
          href: el.link,
        });

        for (const item of el.children) {
          dynamicBreadCrumbs.push({
            title: item.label,
            href: item.link,
          });
        }
      } else if (router.route === el.link) {
        dynamicBreadCrumbs.push({
          title: el.label,
          href: el.link,
        });
      }
    });

    if (dynamicBreadCrumbs) {
      setBreadcrumbItems((prev) => [...prev, ...dynamicBreadCrumbs]);
    }

    if (!isOperator && !isAdmin && !isPromoter && activeBreadcrumb) {
      setBreadcrumbItems((prev) => [
        ...prev,
        {
          title: activeBreadcrumb?.label as string,
          href: activeBreadcrumb?.link as string,
        },
      ]);
    }

    if (isOperator && currentBreadcrumb) {
      setBreadcrumbItems(operatorBreadcrumb);
    }

    if (isPromoter && currentBreadcrumb) {
      setBreadcrumbItems(promoterBreadcrumb);
    }

    if (isAdmin && currentBreadcrumb) {
      setBreadcrumbItems(adminBreadcrumb);
    }

    return () =>
      setBreadcrumbItems(
        isOrganizer
          ? [{ title: "Dashboard", href: "/organization" }]
          : isAdmin
          ? adminBreadcrumb
          : isPromoter
          ? promoterBreadcrumb
          : operatorBreadcrumb
      );
  }, [currentBreadcrumb, activeBreadcrumb, isOperator, router.route, eventData]);

  useEffect(() => {
    if (router.isReady) {
      setKeyword(query as string);
    }
  }, [router, query]);

  const handleSubmitSearch = () => {
    if (keyword && decodeURIComponent(keyword)?.length > 0) {
      router.push(
        isOperator
          ? `/operator?query=${keyword}`
          : isAdmin
          ? `/admin?query=${keyword}`
          : isPromoter
          ? `/promoter/events?query=${keyword}`
          : `/organization/my-events?query=${keyword}`
      );
    } else {
      router.push(
        isOperator
          ? `/operator`
          : isAdmin
          ? `/admin`
          : isPromoter
          ? `/promoter/events`
          : `/organization/my-events`
      );
    }
  };

  return (
    <Header height={78} px="xl" py="md" className={classes.wrapper}>
      <Flex justify={"space-between"} gap={rem(50)}>
        <Input
          onKeyDown={(e) => e.key === "Enter" && handleSubmitSearch()}
          onChange={(e) => setKeyword(encodeURIComponent(e.target.value))}
          value={(keyword && decodeURIComponent(keyword)) || ""}
          icon={<IconSearch onClick={handleSubmitSearch} cursor="pointer" pointerEvents="all" />}
          ml={"1.5rem"}
          rightSection={
            ((keyword && decodeURIComponent(keyword)?.length > 0) || query) && (
              <IconX
                onClick={() => {
                  if (query) {
                    router.push(
                      isOperator
                        ? `/operator`
                        : isAdmin
                        ? `/admin`
                        : isPromoter
                        ? `/promoter/events`
                        : `/organization/my-events`
                    );
                  }
                  setKeyword(null);
                }}
                cursor="pointer"
                pointerEvents="all"
              />
            )
          }
          placeholder={
            isAdmin
              ? "Search Organization Owner"
              : isPromoter
              ? "Search Events"
              : "Search My Events"
          }
          miw={rem(259)}
          styles={{
            input: {
              height: rem(46),
              backgroundColor: "#282B3D",
              border: 0,
              borderRadius: rem(6),
              "&[data-with-icon]": {
                paddingLeft: "2.75rem",
              },
            },
            icon: {
              margin: "0 0.25rem",
            },
          }}
        />
        <Breadcrumbs items={breadcrumbItems} />
      </Flex>
    </Header>
  );
};

export default Navbar;
