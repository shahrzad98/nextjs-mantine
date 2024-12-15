import type { Meta, StoryObj } from "@storybook/react";

import { Footer } from "@/components";

const meta: Meta<typeof Footer> = {
  title: "Footer",
  component: Footer,
  argTypes: {
    groups: {
      table: {
        disable: true,
      },
    },
    copyrightOnly: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

const footerData = [
  {
    title: "Support",
    links: [
      { label: "Support", href: "#1" },
      { label: "Privacy & Security", href: "#2" },
      { label: "Terms of Service", href: "#3" },
      { label: "Ticketing Services Agreement", href: "#4" },
    ],
  },
  {
    title: "novelT Ticketing",
    links: [
      {
        label: "Organization Portal",
        href: "#5",
        props: {
          variant: "gradient",
          gradient: { deg: 45, from: "#3077F3", to: "#15AABF" },
        },
      },
      { label: "Sign In / Sign Up", href: "#6" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About Us", href: "#7" },
      { label: "Contact Us", href: "#8" },
      { label: "For Organizers ", href: "#9" },
    ],
  },
];

export const Default: Story = {
  args: {
    groups: footerData,
    activeLink: "",
    copyrightOnly: false,
  },
};

export const CopyrightOnly: Story = {
  args: {
    copyrightOnly: true,
  },
};
