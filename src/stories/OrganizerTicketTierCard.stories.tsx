import { Grid } from "@mantine/core";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import { OrganizerTicketTierCard } from "@/components";

const meta: Meta<typeof OrganizerTicketTierCard> = {
  title: "Organizer Ticket Tier Card",
  component: OrganizerTicketTierCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrganizerTicketTierCard>;

export const Default: Story = {
  name: "Editable",
  render: ({ ...args }) => (
    <Grid>
      <Grid.Col span={12} sm={6} md={4}>
        <OrganizerTicketTierCard {...args} />
      </Grid.Col>
    </Grid>
  ),
  args: {
    title: "bronze",
    ticketsSold: 0,
    totalTickets: 0,
    price: 0.0,
    onEdit: action("Edit Clicked"),
  },
};

export const DefaultWithQuantity: Story = {
  name: "Non-Editable",
  render: ({ ...args }) => (
    <Grid>
      <Grid.Col span={12} sm={6} md={4}>
        <OrganizerTicketTierCard {...args} />
      </Grid.Col>
    </Grid>
  ),
  args: {
    title: "vip",
    ticketsSold: 0,
    totalTickets: 0,
    price: 0.0,
  },
};
