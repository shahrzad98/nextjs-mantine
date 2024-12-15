import type { Meta, StoryObj } from "@storybook/react";

import { TicketTierCard } from "@/components";

const meta: Meta<typeof TicketTierCard> = {
  title: "Ticket Tier Card",
  component: TicketTierCard,
  // argTypes: { onBuyTicket: { action: "Tickets successfully added to your basket" } },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TicketTierCard>;

export const Default: Story = {
  args: {
    title: "VIP",
    ticketsLeft: 10,
    priceCAD: 500,
    priceUSD: 600,
    description:
      "Buy your Coldplay tickets today! All tickets listed on novelT are coming from our trusted sellers only. Our sellers have a long track record and experience to ensure delivery on time\n" +
      "\n" +
      "Buy Tickets\n" +
      "\n" +
      "Buy your Coldplay tickets today! All tickets \n" +
      "listed on novelT are coming from our trusted \n" +
      "sellers only. Our sellers have a long track recordE\n" +
      "Experience to ensure delivery on time\n" +
      "\n" +
      "Buy your Coldplay tickets today! All tickets listed on novelT are coming from our trusted sellers only. Our sellers have a long track record and experience to ensure delivery on time, Buy your Coldplay tickets today! All tickets listed on novelT are coming from Our sellers have a long track record and experience to ensure delivery on time, Buy your Coldplay tickets today! All tickets listed on novelT are coming from Our sellers have a long track record and experience to ensure delivery on time, Buy your Coldplay tickets today! All tickets listed on novelT are coming from Coldplay tickets today! All tickets listed on novelT are coming Buy your Coldplay tickets today! All tickets listed on novelT are coming from our trusted sellers only. Our sellers have a long track record and experience to ensure delivery on time, Buy your Coldplay tickets today! All tickets listed on novelT are coming from Our sellers have a long track record and experience to ensure delivery on time, Buy your Coldplay tickets today! All tickets listed on novelT are coming from Our sellers have a long track record and experience to ensure delivery on time, Buy your Coldplay tickets today! All tickets listed on novelT are coming from Coldplay tickets today! All tickets listed on novelT are coming Buy your Coldplay tickets today! All tickets listed on novelT are coming from our trusted sellers only. Our sellers have a long track record and experience\n" +
      "\n" +
      "Buy Tickets\n" +
      "\n" +
      "Buy your Coldplay tickets today! All tickets \n" +
      "listed on novelT are coming from our trusted \n" +
      "sellers only. Our sellers have a long track record\n" +
      "Experience to ensure delivery on time",
  },
};
