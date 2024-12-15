import { Modal, Flex, rem, Button, Title, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { FC } from "react";

interface IStripeSetupModal {
  opened: boolean;
}

export const StripeSetupModal: FC<IStripeSetupModal> = ({ opened }) => {
  const router = useRouter();

  const handleNavigateToSettings = () => {
    router.push("/organization/settings");
  };

  const handleNavigateToDashboard = () => {
    router.push("/organization");
  };

  return (
    <Modal
      opened={opened}
      onClose={() => null}
      w={324}
      withCloseButton={false}
      centered
      styles={{
        content: {
          backgroundColor: "#1E2130",
        },
      }}
    >
      <Flex direction={"column"} p={rem(16)}>
        <Title size={rem(20)} fw={600} ta="center">
          Configure your Organization’s Payout Settings First!
        </Title>
        <Text ta={"left"} mt={rem(22)}>
          In order to create an event, your payout settings must be configured so that novelT has
          the ability to transfer your ticket sale earnings.
        </Text>
        <Button
          variant="gradient"
          size="md"
          fw={300}
          mt={rem(32)}
          gradient={{ from: "#3077F3", to: "#15AABF" }}
          onClick={handleNavigateToSettings}
        >
          Go to Organization Settings
        </Button>
        <Button
          variant="outline"
          size="md"
          fw={300}
          onClick={handleNavigateToDashboard}
          mt={rem(11)}
          mb={rem(12)}
        >
          Cancel
        </Button>
      </Flex>
    </Modal>
  );
};
