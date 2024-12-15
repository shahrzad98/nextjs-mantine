import type { Meta, StoryObj } from "@storybook/react";

import { TicketCard } from "@/components";

const meta: Meta<typeof TicketCard> = {
  title: "Mantine Ticket Card",
  component: TicketCard,
};

export default meta;
type Story = StoryObj<typeof TicketCard>;

const defaultProps = {
  date: "Fri, Mar 12 2023",
  time: "7:00 PM - 9:00 PM",
  location: "Street, City, Country",
  title: "Event Name Here Event Name Here and Here",
  usdPrice: 98,
  thumbnail:
    "https://images.unsplash.com/photo-1627552245715-77d79bbf6fe2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80",
};

export const Default: Story = {
  name: "Original",
  args: {
    ...defaultProps,
    type: "original",
    currency: "USD",
    admission: "GENERAL ADMISSION 1",
  },
};

export const DefaultWithQuantity: Story = {
  name: "Original with Quantity",
  args: {
    ...defaultProps,
    type: "original",
    currency: "USD",
    admission: "GENERAL ADMISSION 1",
    quantity: 3,
  },
};

export const DefaultWithCurrency: Story = {
  name: "Original with CAD price",
  args: {
    ...defaultProps,
    type: "original",
    currency: "CAD",
    cadPrice: 110,
    admission: "GENERAL ADMISSION 1",
    quantity: 3,
  },
};

export const Long: Story = {
  name: "Long",
  args: {
    ...defaultProps,
    type: "long",
    tier: "SILVER",
    qrCode:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png",
  },
};

export const LongWithCurrency: Story = {
  name: "Long with CAD price",
  args: {
    ...defaultProps,
    type: "long",
    tier: "SILVER",
    currency: "CAD",
    cadPrice: 110,
    qrCode:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png",
  },
};
