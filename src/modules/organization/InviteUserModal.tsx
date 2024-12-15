import { IOrganizationTeamMemberRequest } from "@/types/organization";
import { emailRegex } from "@/utils";
import { Modal, rem, Title, Button, ModalProps, Flex, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface IInviteUserModalProps extends ModalProps {
  onModalSubmit: (values: IOrganizationTeamMemberRequest) => void;
  submitLoading?: boolean;
}

export const InviteUserModal = ({
  onModalSubmit,
  submitLoading,
  ...props
}: IInviteUserModalProps) => {
  const { getInputProps, isDirty, onSubmit, reset } = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
    },

    validate: {
      first_name: (value) =>
        value.replace(/\s/g, "").length === 0
          ? "First Name can't be empty."
          : !/^[^#%@&*:<>?/{|}]+$/.test(value)
          ? "First Name should not contain any special characters!"
          : null,
      last_name: (value) =>
        value.replace(/\s/g, "").length === 0
          ? "Last Name can't be empty."
          : !/^[^#%@&*:<>?/{|}]+$/.test(value)
          ? "Last Name should not contain any special characters!"
          : null,
      email: (value) =>
        emailRegex.test(value)
          ? null
          : value.length > 0
          ? "Invalid Email."
          : "Email can't be empty.",
    },
  });

  const handleSubmit = (values: IOrganizationTeamMemberRequest) => {
    onModalSubmit(values);
    reset();
    props.onClose();
  };

  const handleClose = () => {
    reset();
    props.onClose();
  };

  return (
    <Modal
      withCloseButton={false}
      centered
      size={rem(356)}
      styles={{ content: { backgroundColor: "#282b3d" } }}
      {...props}
      onClose={handleClose}
    >
      <Title
        order={4}
        size="h3"
        fz={rem(20)}
        mt={rem(10)}
        mb={rem(14)}
        align="center"
        color="#FFFFFFCC"
        fw={600}
      >
        Invite User
      </Title>
      <form onSubmit={onSubmit((values) => handleSubmit(values))}>
        <Stack spacing={rem(14)} px={rem(8)}>
          <TextInput
            label="First Name"
            withAsterisk
            placeholder="John"
            {...getInputProps("first_name")}
          />
          <TextInput
            label="Last Name"
            withAsterisk
            placeholder="Doe"
            {...getInputProps("last_name")}
          />
          <TextInput
            label="Email"
            withAsterisk
            placeholder="johndoe@gmail.com"
            {...getInputProps("email")}
          />
        </Stack>
        <Flex justify="center" mt={rem(40)} mb={rem(10)} gap={rem(12)}>
          <Button variant="outline" h={rem(44)} fs={rem(15)} fw={400} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: "#3077F3", to: "#15AABF" }}
            h={rem(44)}
            fs={rem(15)}
            fw={400}
            disabled={!isDirty()}
            type="submit"
            loading={submitLoading}
            sx={{
              "&[data-disabled]": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
            }}
          >
            Send Invitation
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};
