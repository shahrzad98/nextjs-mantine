import {
  IOrganizationAdmin,
  IOrganizationOperator,
  IOrganizationOwner,
} from "@/types/organization";
import { snakeToTitleCase } from "@/utils";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";

import TrashIcon from "./assets/trash.svg";

interface ITeamMemberListProps {
  members: (IOrganizationAdmin | IOrganizationOwner | IOrganizationOperator)[];
  addedMemberId: string | null;
  onDelete: (id: string) => void;
}

const useStyles = createStyles((theme) => ({
  ticketsTable: {
    minWidth: "600px",
    "& th": {
      padding: "0.85rem !important",
      color: "#FFFFFF",
      fontSize: rem(16),
      "&:first-of-type": {
        paddingLeft: `${rem(16)} !important`,
      },
      [`@media (max-width: 600px)`]: {
        minWidth: 200,
      },
    },
    "& tr.active": {
      backgroundColor: "#00530E !important",
    },
    "& tbody tr:not(.active):hover": {
      backgroundColor: "#282b3d !important",
      "& td": {
        color: "#3077F3 !important",
      },
    },
    "& td": {
      fontSize: `${rem(16)} !important`,
      fontWeight: 400,
      borderTop: "none",
      color: "#FFFFFFB2",
      borderBottom: `${rem(1)} solid ${theme.colors.dark[4]}`,
      "&:first-of-type": {
        paddingLeft: rem(16),
      },
      "&:nth-child(2)": {
        fontSize: `${rem(14)} !important`,
      },
    },
  },
}));

export const TeamMemberList = ({ members, addedMemberId, onDelete }: ITeamMemberListProps) => {
  const { classes } = useStyles();

  return (
    <Table className={classes.ticketsTable} verticalSpacing="lg" striped highlightOnHover>
      <thead>
        <tr>
          <th>
            <Text fw={500} color="#fff" span>
              Team Member
            </Text>
          </th>
          <th>
            <Text fw={500} color="#fff" span>
              Email
            </Text>
          </th>
          <th>
            <Text fw={500} color="#fff" span>
              Status
            </Text>
          </th>
          <th>
            <Text fw={500} color="#fff" span>
              Role
            </Text>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, i) => (
          <TeamMember
            key={i}
            member={member}
            onDelete={onDelete}
            isActive={addedMemberId === member.id}
          />
        ))}
      </tbody>
    </Table>
  );
};

const TeamMember = ({
  member,
  isActive,
  onDelete,
}: {
  member: IOrganizationAdmin | IOrganizationOwner | IOrganizationOperator;
  isActive: boolean;
  onDelete: (id: string) => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = () => {
    onDelete(member.id);
    close();
  };

  return (
    <>
      <tr key={member.email} className={isActive ? "active" : undefined}>
        <td>
          {member?.first_name} {member?.last_name}
        </td>
        <td>{member.email}</td>
        <td>{snakeToTitleCase(member.status)}</td>
        <td>{snakeToTitleCase(member.role)}</td>
        <td>
          {member.role === "operator" && (
            <Group position="right" mr={"0.5rem"}>
              <ActionIcon onClick={open}>
                <Image src={TrashIcon} alt="Delete" />
              </ActionIcon>
            </Group>
          )}
        </td>
      </tr>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        size={rem(382)}
        styles={{ content: { backgroundColor: "#282b3d" } }}
      >
        <Title order={4} size="h3" mt={rem(16)} mb={rem(27)} align="center" color="#FFFFFFCC">
          Delete User
        </Title>
        <Text color="#FFFFFFB2" align="center" fw={300}>
          Are you sure you want to delete {member?.first_name} {member?.last_name}?
        </Text>
        <Stack align="center" mt={rem(33)} mb={rem(26)} spacing={rem(12)}>
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
  );
};
