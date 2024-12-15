import { UserType } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";

import DashboardSidebar from "../components/OrganizerDashboardLayout/Sidebar";

const meta: Meta<typeof DashboardSidebar> = {
  component: DashboardSidebar,
  title: "Dashboard Sidebar",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** With no props provided, DashboardNavbar is expanded and on the organizers mode */
export const Default: Story = { args: { collapsed: false } };
export const Collapsed: Story = { args: { collapsed: true } };

/**  In Operators mode, user can only see "Dashboard" & "Attendee Side" */
export const OperatorView: Story = { args: { role: UserType.Operator } };
