import type { Meta, StoryObj } from "@storybook/react";

import { HomeSearch } from "@/components";

const meta: Meta<typeof HomeSearch> = {
  title: "Home Search",
  component: HomeSearch,
};

export default meta;
type Story = StoryObj<typeof HomeSearch>;

export const Primary: Story = {};
