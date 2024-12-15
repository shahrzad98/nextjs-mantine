import { Stack, rem, Divider, StackProps } from "@mantine/core";
import { ReactNode } from "react";

interface ISettingsSection extends StackProps {
  title: string;
  children: ReactNode;
}

export const SettingsSection = ({ title, children, ...props }: ISettingsSection) => (
  <Stack spacing={rem(20)} {...props}>
    <Divider label={title} labelProps={{ size: rem(14), color: "rgba(255, 255, 255, 0.80)" }} />
    {children}
  </Stack>
);
