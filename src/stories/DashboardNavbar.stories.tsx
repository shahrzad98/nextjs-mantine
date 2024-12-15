import type { Meta, StoryObj } from "@storybook/react";

import DashboardNavbar from "@/components/OrganizerDashboardLayout/Navbar";

const meta: Meta<typeof DashboardNavbar> = {
  component: DashboardNavbar,
  title: "Dashboard Navbar",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { collapsed: true } };
