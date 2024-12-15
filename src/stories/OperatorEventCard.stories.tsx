/* eslint-disable @typescript-eslint/no-empty-function */
import { Grid } from "@mantine/core";
import type { Meta, StoryObj } from "@storybook/react";

import { OperatorEventCard } from "@/components";

const meta: Meta<typeof OperatorEventCard> = {
  title: "Operator Event Card",
  component: OperatorEventCard,
  argTypes: {
    onClick: { action: "Card Clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof OperatorEventCard>;

export const Default: Story = {
  render: ({ ...args }) => (
    <Grid>
      <Grid.Col span={12} sm={6} md={3}>
        <OperatorEventCard {...args} />
      </Grid.Col>
    </Grid>
  ),
  args: {
    ticketsLeft: 999,
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
    date: "Mon, Feb 22nd 2023",
    time: "4:00 PM - 8:00 PM",
    title: "Coldplay",
    address: "4 Pennsylvania Plaza, New York, NY 10001, United States",
  },
};
