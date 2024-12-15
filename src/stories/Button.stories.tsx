import { Button } from "@mantine/core";
import type { Meta, StoryObj } from "@storybook/react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: "Mantine Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: {
        type: "select",
      },
      options: ["default", "cyan", "dark", "gray", "red", "indigo"],
    },
    variant: {
      control: {
        type: "select",
      },
      options: ["default", "filled", "outline"],
    },
    onClick: { action: "Mantine Button Clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    children: "novelT",
  },
};

export const Secondary: Story = {
  args: {
    children: "novelT",
    color: "dark",
  },
};

export const Large: Story = {
  args: {
    size: "xl",
    children: "novelT",
  },
};

export const Small: Story = {
  args: {
    size: "xs",
    children: "novelT",
  },
};
