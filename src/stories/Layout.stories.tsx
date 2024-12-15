import { Blockquote, SimpleGrid, Skeleton } from "@mantine/core";
import type { Meta, StoryObj } from "@storybook/react";

import { NVTLayout } from "@/components";

const meta: Meta<typeof NVTLayout> = {
  title: "Layout",
  component: NVTLayout,
  argTypes: {
    navbarProps: {
      disable: true,
    },
    footerProps: {
      disable: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVTLayout>;

export const Default: Story = {
  render: ({ ...args }) => (
    <NVTLayout {...args}>
      <>
        <Blockquote cite="– Dev Team">NVTLayout is Awesome!</Blockquote>
        <Skeleton height={8} mt="1rem" radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
        <SimpleGrid
          cols={3}
          mt="2rem"
          sx={(theme) => ({
            div: {
              background: theme.colors.dark[5],
            },
          })}
        >
          <div style={{ height: "200px" }}>1</div>
          <div style={{ height: "200px" }}>2</div>
          <div style={{ height: "200px" }}>3</div>
          <div style={{ height: "200px" }}>4</div>
          <div style={{ height: "200px" }}>5</div>
        </SimpleGrid>
      </>
    </NVTLayout>
  ),
  args: {
    hasNavbar: true,
    hasFooter: true,
    activeLink: "",
  },
};
