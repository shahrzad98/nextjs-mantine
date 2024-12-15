import { Box, Button, Container, Flex, Modal, Stack, Text, Title, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

interface IDraftEventMobileActionsProps {
  isPublishable: boolean;
  isRescheduled: boolean;
  onPublish: () => void;
  onDelete: () => void;
  eventName: string;
}

export const DraftEventMobileActions = ({
  isPublishable,
  isRescheduled,
  onPublish,
  onDelete,
  eventName,
}: IDraftEventMobileActionsProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = () => {
    onDelete();
    close();
  };

  return (
    <>
      <Box bg="dark" pos="sticky" sx={{ bottom: 0 }}>
        <Container py={rem(16)}>
          <Flex gap={rem(10)} wrap="wrap">
            {!isRescheduled && (
              <Button
                h={rem(44)}
                fw={400}
                fs={rem(15)}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 45 }}
                fullWidth
                disabled={!isPublishable}
                onClick={onPublish}
              >
                Publish Event
              </Button>
            )}
            <Button
              component={Link}
              href={`/organization/my-events`}
              h={rem(44)}
              fw={400}
              fs={rem(15)}
              variant="outline"
              sx={{ flex: 1 }}
            >
              View My Events
            </Button>
            {!isRescheduled && (
              <Button
                h={rem(44)}
                fw={400}
                fs={rem(15)}
                variant="outline"
                color="red"
                onClick={open}
                sx={{ flex: 1 }}
              >
                Delete Event
              </Button>
            )}
          </Flex>
        </Container>
      </Box>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        size={rem(382)}
        styles={(theme) => ({
          content: {
            background: theme.colors.nvtPrimary[4],
          },
          body: {
            padding: "0 22px",
          },
        })}
      >
        <Title
          order={4}
          size={rem(20)}
          fw={600}
          c="rgba(255, 255, 255, 0.80)"
          mt={rem(26)}
          mb={rem(19)}
          align="center"
        >
          Delete Event
        </Title>
        <Text c="rgba(255, 255, 255, 0.70)" align="center" fz={rem(14)} fw={300} lts="-0.28px">
          Are you sure you want to delete {eventName}?
        </Text>
        <Stack align="center" mt={rem(25)} mb={rem(42)} spacing={rem(12)}>
          <Button
            color="red"
            bg="#E03130"
            fullWidth
            maw={rem(266)}
            h={rem(44)}
            fz={rem(15)}
            fw={400}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            variant="outline"
            fullWidth
            maw={rem(266)}
            h={rem(44)}
            fz={rem(15)}
            fw={400}
            onClick={close}
          >
            Cancel
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
