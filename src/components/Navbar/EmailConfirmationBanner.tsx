import { useBreakpoint } from "@/hooks";
import { Flex, rem, Group, Button, Text } from "@mantine/core";
import { useRouter } from "next/router";

interface IEmailConfirmationBanner {
  variant?: "default" | "myAccount";
}

export const EmailConfirmationBanner = ({ variant = "default" }: IEmailConfirmationBanner) => {
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  return (
    <Flex
      px={rem(10)}
      h={rem(
        isMobile && variant === "default" ? 40 : isMobile ? 35 : variant === "default" ? 50 : 42
      )}
      justify="center"
      align="center"
      sx={(theme) => ({ background: theme.colors.red[8] })}
    >
      <Group spacing={rem(10)}>
        <Text color="white" fz={rem(isMobile ? 10 : 14)} lh="155%">
          {variant === "default"
            ? "Please confirm your email address."
            : "Please confirm your email address to continue."}
        </Text>
        {variant === "default" && (
          <Button
            variant="white"
            c="red"
            fz={rem(isMobile ? 7 : 14)}
            fw={600}
            p={`${rem(4)} ${rem(8.5)}`}
            lh="155%"
            h="auto"
            onClick={() => router.push("/my-account")}
          >
            Resend Email Verification or Change Email
          </Button>
        )}
      </Group>
    </Flex>
  );
};
