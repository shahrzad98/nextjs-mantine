import { UserType } from "@/types";
import {
  IconCalendar,
  IconCalendarDue,
  IconChartPie2,
  IconCreditCard,
  IconExternalLink,
  IconHexagon,
  IconHome,
  IconLayoutSidebar,
  IconLogin,
  IconSettings,
  IconTicket,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

const guestDesktopLinks = [
  // {
  //   link: "https://support.novelt.io",
  //   label: "Support",
  //   target: "_blank",
  // },
  {
    link: "/for-organizers",
    label: "For Organizers",
  },
];

const guestMobileLinks = [
  {
    link: "/auth/signup",
    label: "Sign In / Sign Up",
    icon: <IconLogin />,
  },
  {
    link: "/",
    label: "Home",
    icon: <IconHome />,
  },
  {
    link: "/for-organizers",
    label: "For Organizers",
    icon: <IconLayoutSidebar />,
  },
  // {
  //   link: "https://support.novelt.io",
  //   label: "Support",
  //   icon: <IconLifebuoy />,
  //   target: "_blank",
  // },
];

const attendeeDesktopLinks = [
  {
    link: "/my-account",
    label: "My Account",
  },
  {
    link: "/my-tickets",
    label: "My Tickets",
  },
  {
    link: "https://support.novelt.io",
    label: "Support",
    target: "_blank",
  },
];

const attendeeMobileLinks = [
  {
    link: "/",
    label: "Home",
    icon: <IconHome />,
  },
  {
    link: "/my-account",
    label: "My Account",
    icon: <IconUser />,
  },
  {
    link: "/my-tickets",
    label: "My Tickets",
    icon: <IconCreditCard />,
  },
  // {
  //   link: "https://support.novelt.io",
  //   label: "Support",
  //   icon: <IconLifebuoy />,
  //   target: "_blank",
  // },
];

const organizerLinks = [
  {
    link: "/organization",
    label: "Dashboard",
    icon: <IconChartPie2 />,
  },
  {
    link: "/organization/my-account",
    label: "My Account",
    icon: <IconUser />,
  },
  {
    link: "/organization/my-events",
    label: "My Events",
    icon: <IconCalendar />,
  },
  {
    link: "/organization/settings",
    label: "Organization Settings",
    icon: <IconSettings />,
  },
  {
    link: "/organization/team-management",
    label: "Team Management",
    icon: <IconUsers />,
  },
  {
    link: "/organization/promoters",
    label: "Promoters",
    icon: <IconHexagon />,
  },
  {
    link: "/organization/ticket-inspector",
    label: "Ticket Inspector",
    icon: <IconTicket />,
  },
  {
    link: "/",
    label: "Attendee Side",
    icon: <IconExternalLink />,
    hasDesktopIcon: true,
  },
];

const operatorLinks = [
  {
    link: "/operator",
    label: "Dashboard",
    icon: <IconChartPie2 />,
  },
  {
    link: "/",
    label: "Attendee Side",
    icon: <IconExternalLink />,
    hasDesktopIcon: true,
  },
];

const adminLinks = [
  {
    link: "/admin",
    label: "Dashboard",
    icon: <IconChartPie2 />,
  },
  {
    link: "/",
    label: "Attendee Side",
    icon: <IconExternalLink />,
    hasDesktopIcon: true,
  },
];

const promoterLinks = [
  {
    link: "/promoter",
    label: "Dashboard",
    icon: <IconChartPie2 />,
  },

  { icon: <IconUser />, label: "My Account", link: "/promoter/my-account" },
  {
    icon: <IconCalendarDue />,
    label: "Events",
    link: "/promoter/events",
    subLinks: ["/organization/event/[id]"],
  },
  {
    link: "/",
    label: "Attendee Side",
    icon: <IconExternalLink />,
    hasDesktopIcon: true,
  },
];

export const navbarLinks = {
  [UserType.Guest]: {
    desktopLinks: guestDesktopLinks,
    mobileLinks: guestMobileLinks,
  },
  [UserType.Attendee]: {
    desktopLinks: attendeeDesktopLinks,
    mobileLinks: attendeeMobileLinks,
  },
  [UserType.Organizer]: {
    desktopLinks: organizerLinks,
    mobileLinks: organizerLinks,
  },
  [UserType.Operator]: {
    desktopLinks: operatorLinks,
    mobileLinks: operatorLinks,
  },
  [UserType.Admin]: {
    desktopLinks: adminLinks,
    mobileLinks: adminLinks,
  },
  [UserType.Promoter]: {
    desktopLinks: promoterLinks,
    mobileLinks: promoterLinks,
  },
};

export const loggedOutFooterData = [
  {
    title: "Support",
    links: [
      // { label: "Support", href: "https://support.novelt.io", target: "_blank" },
      { label: "Privacy & Security", href: "/privacy-and-security", target: "_blank" },
      {
        label: "Terms of Service",
        href: "/terms-of-service",
        target: "_blank",
      },
      {
        label: "Ticketing Services Agreement",
        href: "/ticketing-services-agreement",
        target: "_blank",
      },
    ],
  },
  {
    title: "novelT Ticketing",
    links: [
      {
        label: "Organization Portal",
        href: "/organization",
        props: {
          variant: "gradient",
          gradient: { deg: 45, from: "#3077F3", to: "#15AABF" },
        },
      },
      { label: "Sign In / Sign Up", href: "/auth/signup" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "For Organizers ", href: "/for-organizers" },
    ],
  },
];

export const loggedInFooterData = [
  {
    title: "Support",
    links: [
      // { label: "Support", href: "https://support.novelt.io", target: "_blank" },
      { label: "Privacy & Security", href: "/privacy-and-security", target: "_blank" },
      {
        label: "Terms of Service",
        href: "/terms-of-service",
        target: "_blank",
      },
      {
        label: "Ticketing Services Agreement",
        href: "/ticketing-services-agreement",
        target: "_blank",
      },
    ],
  },
  {
    title: "novelT Ticketing",
    links: [
      {
        label: "Organization Portal",
        href: "/organization",
        props: {
          variant: "gradient",
          gradient: { deg: 45, from: "#3077F3", to: "#15AABF" },
        },
      },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "For Organizers ", href: "/for-organizers" },
    ],
  },
];
