import { useBreakpoint } from "@/hooks";
import { Anchor, Spoiler, SpoilerProps, rem, Text } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

export const ExpandableText = ({ ...props }: Omit<SpoilerProps, "showLabel" | "hideLabel">) => {
  const { isMobile } = useBreakpoint();

  return (
    <Spoiler
      {...props}
      showLabel={
        <Anchor
          mt={rem(16)}
          fz={rem(16)}
          fw={600}
          sx={{ display: "flex", gap: rem(15), alignItems: "center" }}
          c="#3077F3"
        >
          Show more details <IconChevronDown size={22} />
        </Anchor>
      }
      hideLabel={
        <Anchor
          mt={rem(16)}
          fz={rem(16)}
          fw={600}
          sx={{ display: "flex", gap: rem(15), alignItems: "center" }}
          c="#3077F3"
        >
          Hide details <IconChevronUp size={22} />
        </Anchor>
      }
    >
      <Text size={isMobile ? 16 : 20}>{props.children}</Text>
    </Spoiler>
  );
};
