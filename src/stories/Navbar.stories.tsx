import { Group, rem, Text } from "@mantine/core";
import type { Meta, StoryObj } from "@storybook/react";
import {
  IconCalendar,
  IconChartPie2,
  IconCreditCard,
  IconExternalLink,
  IconHome,
  IconInfoCircle,
  IconLayoutSidebar,
  IconLifebuoy,
  IconLogin,
  IconSettings,
  IconShoppingBag,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import { Navbar } from "@/components";
import { NavbarVariant } from "@/components/Navbar/types";

const meta: Meta<typeof Navbar> = {
  title: "Navbar",
  component: Navbar,
  argTypes: {
    // onLogout: {
    //   table: {
    //     disable: true,
    //   },
    //   action: "Handle Logout",
    // },
    links: {
      table: {
        disable: true,
      },
    },
    rightSideActions: {
      table: {
        disable: true,
      },
    },
    mobileLinks: {
      table: {
        disable: true,
      },
    },
    activeLink: {
      control: { type: "text", defaultValue: "as" },
    },
    sticky: {
      control: { type: "boolean" },
    },
    currentPageTitle: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

const defaultArguments = {
  activeLink: "",
  sticky: false,
  currentPageTitle: "",
};

export const Basic: Story = {
  args: {
    variant: NavbarVariant.Basic,
    background: "none",
  },
};

const guestDesktopLinks = [
  {
    link: "https://support.novelt.io",
    label: "Support",
    target: "_blank",
  },
  {
    link: "/for-organizers",
    label: "For Organizers",
  },
];

const guestMobileLinks = [
  {
    link: "/auth/register",
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
  {
    link: "https://support.novelt.io",
    label: "Support",
    icon: <IconLifebuoy />,
    target: "_blank",
  },
];

export const Guest: Story = {
  args: {
    variant: NavbarVariant.Guest,
    background: "filled",
    links: guestDesktopLinks,
    mobileLinks: guestMobileLinks,
    ...defaultArguments,
  },
};

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
  {
    link: "/sell-tickets",
    label: "Sell Tickets",
    icon: <IconShoppingBag />,
  },
  {
    link: "/organization-panel",
    label: "Organization Panel",
    icon: <IconExternalLink />,
  },
  {
    link: "https://support.novelt.io",
    label: "Support",
    icon: <IconLifebuoy />,
    target: "_blank",
  },
];

export const Attendee: Story = {
  args: {
    variant: NavbarVariant.Attendee,
    background: "filled",
    links: attendeeDesktopLinks,
    mobileLinks: attendeeMobileLinks,
    ...defaultArguments,
  },
};

const organizerLinks = [
  {
    link: "/dashboard",
    label: "Dashboard",
    icon: <IconChartPie2 />,
  },
  {
    link: "/my-account",
    label: "My Account",
    icon: <IconUser />,
  },
  {
    link: "/my-events",
    label: "My Events",
    icon: <IconCalendar />,
  },
  {
    link: "/organization-settings",
    label: "Organization Settings",
    icon: <IconSettings />,
  },
  {
    link: "/team-management",
    label: "Team Management",
    icon: <IconUsers />,
  },
  {
    link: "/attende-side",
    label: "Attendee Side",
    icon: <IconExternalLink />,
    hasDesktopIcon: true,
  },
];

export const Organizer: Story = {
  args: {
    variant: NavbarVariant.Organizer,
    links: organizerLinks,
    mobileLinks: organizerLinks,
    ...defaultArguments,
  },
};

const operatorLinks = [
  {
    link: "/dashboard",
    label: "Dashboard",
    icon: <IconChartPie2 />,
  },
  {
    link: "/attende-side",
    label: "Attendee Side",
    icon: <IconExternalLink />,
    hasDesktopIcon: true,
  },
];

export const Operator: Story = {
  args: {
    variant: NavbarVariant.Operator,
    background: "filled",
    links: operatorLinks,
    mobileLinks: operatorLinks,
    ...defaultArguments,
  },
};

export const AttendeeWithActions: Story = {
  name: "Attendee With Mobile Actions",
  args: {
    variant: NavbarVariant.Attendee,
    background: "filled",
    links: attendeeDesktopLinks,
    mobileLinks: attendeeMobileLinks,
    ...defaultArguments,
    currentPageTitle: "Sample Page",
    rightSideActions: (
      <Group spacing={rem(5)}>
        <Text c="blue">2:00</Text>
        <IconInfoCircle color="gray" />
      </Group>
    ),
  },
};
