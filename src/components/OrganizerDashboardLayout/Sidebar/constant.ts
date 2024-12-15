import {
  IconCalendarDue,
  IconChartPie2,
  IconExternalLink,
  IconHexagon,
  IconSettings,
  IconTicket,
  IconUser,
  IconUsers,
  TablerIconsProps,
} from "@tabler/icons-react";
import { ReactElement } from "react";

export interface INavbarItem {
  icon: (props: TablerIconsProps) => ReactElement;
  label: string;
  link: string;
  subLinks?: string[];
}

export const organizerNavbarItems: INavbarItem[] = [
  { icon: IconChartPie2, label: "Dashboard", link: "/organization" },
  { icon: IconUser, label: "My Account", link: "/organization/my-account" },
  {
    icon: IconCalendarDue,
    label: "My Events",
    link: "/organization/my-events",
    subLinks: [
      "/organization/event/[id]/promoter/[promoterId]",
      "/organization/event/[id]",
      "/organization/event/[id]/edit",
      "/organization/create-event/basic-info",
      "/organization/create-event/[id]/ticket-tiers",
    ],
  },
  { icon: IconSettings, label: "Organization Settings", link: "/organization/settings" },
  { icon: IconUsers, label: "Team Management", link: "/organization/team-management" },
  {
    icon: IconHexagon,
    label: "Promoters",
    link: "/organization/promoters",
    subLinks: ["/organization/promoter/[id]/scan", "/organization/ticket-inspector/[id]"],
  },
  {
    icon: IconTicket,
    label: "Ticket Inspector",
    link: "/organization/ticket-inspector",
    subLinks: ["/organization/ticket-inspector/[id]/scan", "/organization/ticket-inspector/[id]"],
  },
  { icon: IconExternalLink, label: "Attendee side", link: "/" },
];

export const operatorNavbarItems: INavbarItem[] = [
  { icon: IconChartPie2, label: "Dashboard", link: "/operator" },
  { icon: IconExternalLink, label: "Attendee side", link: "/" },
];

export const adminNavbarItems: INavbarItem[] = [
  { icon: IconChartPie2, label: "Dashboard", link: "/admin" },
  { icon: IconExternalLink, label: "Attendee side", link: "/" },
];

export const promoterNavbarItems: INavbarItem[] = [
  { icon: IconChartPie2, label: "Dashboard", link: "/promoter" },
  { icon: IconUser, label: "My Account", link: "/promoter/my-account" },
  {
    icon: IconCalendarDue,
    label: "Events",
    link: "/promoter/events",
    subLinks: ["/organization/event/[id]"],
  },
  { icon: IconExternalLink, label: "Attendee side", link: "/" },
];

export interface navItem {
  label: string;
  link: string;
}
