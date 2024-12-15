import type { Meta, StoryObj } from "@storybook/react";

import { HomeEventCard } from "@/components";

const meta: Meta<typeof HomeEventCard> = {
  title: "Home Event Card ",
  component: HomeEventCard,
  tags: ["autodocs"],
  argTypes: {
    onClick: {
      action: "Home Event Card Action Clicked!",
    },
  },
};
export default meta;

type story = StoryObj<typeof HomeEventCard>;

export const HomeEventCardLarge: story = {
  args: {
    variant: "lg",
    name: "Coldplay Group",
  },
};

export const HomeEventCardSmall: story = {
  args: {
    variant: "sm",
  },
};
