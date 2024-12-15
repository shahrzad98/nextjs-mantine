import { useBreakpoint } from "@/hooks";
import { Button, Container, Flex, Group, Modal, rem, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface IDraftHeaderProps {
  isPublishable: boolean;
  isDeletable: boolean;
  isRescheduled: boolean;
  onPublish: () => void;
  onDelete: () => void;
  eventName: string;
}

export const DraftHeader = ({
  isPublishable,
  isDeletable,
  isRescheduled,
  onPublish,
  onDelete,
  eventName,
}: IDraftHeaderProps) => {
  const router = useRouter();
  const { isTablet } = useBreakpoint();
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = () => {
    onDelete();
    close();
  };

  return (
    <Container maw={rem(1186)}>
      <Flex
        h={rem(isTablet ? 48 : 81)}
        mb={rem(isTablet ? 19 : 0)}
        justify="space-between"
        align="center"
      >
        {!isTablet && (
          <>
            <Title order={3}>Summary</Title>
            <Group spacing={rem(12)}>
              <Button
                disabled={!isDeletable}
                component={Link}
                href={`/organization/event/${router.query.id}/edit`}
                h={rem(44)}
                fw={400}
                fs={rem(15)}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 45 }}
                leftIcon={<IconPencil />}
              >
                Edit Event
              </Button>
              {!isRescheduled && (
                <>
                  <Button
                    h={rem(44)}
                    fw={400}
                    fs={rem(15)}
                    variant="outline"
                    disabled={!isPublishable}
                    onClick={onPublish}
                  >
                    Publish
                  </Button>
                  <Button
                    h={rem(44)}
                    fw={400}
                    fs={rem(15)}
                    variant="outline"
                    color="red"
                    disabled={!isDeletable}
                    onClick={open}
                  >
                    Delete Event
                  </Button>
                </>
              )}
            </Group>
            <Modal opened={opened} onClose={close} withCloseButton={false} centered size={rem(382)}>
              <Title order={4} size="h3" mt={rem(32)} mb={rem(27)} align="center">
                Delete Event
              </Title>
              <Text color="dimmed" align="center">
                Are you sure you want to delete {eventName}?
              </Text>
              <Stack align="center" mt={rem(33)} mb={rem(42)} spacing={rem(12)}>
                <Button
                  color="red"
                  fullWidth
                  maw={rem(266)}
                  h={rem(44)}
                  fs={rem(15)}
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
                  fs={rem(15)}
                  fw={400}
                  onClick={close}
                >
                  Cancel
                </Button>
              </Stack>
            </Modal>
          </>
        )}
      </Flex>
    </Container>
  );
};
