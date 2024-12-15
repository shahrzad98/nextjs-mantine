import { emailRegex } from "@/utils";
import { NumberInput } from "@mantine/core";
import { Modal, rem, Title, Button, ModalProps, Flex, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface IInviteOrganizationModalProps extends ModalProps {
  onModalSubmit: ({
    email,
    commission_percentage,
  }: {
    email: string;
    commission_percentage: number;
  }) => void;
  submitLoading?: boolean;
}

export const InviteOrganizationModal = ({
  onModalSubmit,
  submitLoading,
  ...props
}: IInviteOrganizationModalProps) => {
  const { getInputProps, isDirty, onSubmit, reset } = useForm({
    initialValues: {
      email: "",
      commission_percentage: 10,
    },

    validate: {
      email: (value) =>
        emailRegex.test(value)
          ? null
          : value.length > 0
          ? "Invalid Email."
          : "Email can't be empty.",
      commission_percentage: (value) =>
        value >= 6 ? null : "Commission Percentage Should Not Be Less Than 6%",
    },
  });

  const handleSubmit = (values: { email: string; commission_percentage: number }) => {
    onModalSubmit({ email: values.email, commission_percentage: values.commission_percentage });
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
        mb={rem(11)}
        align="center"
        color="#FFFFFFCC"
        fw={600}
      >
        Invite Organization
      </Title>
      <form onSubmit={onSubmit((values) => handleSubmit(values))}>
        <Stack spacing={rem(14)} px={rem(9)}>
          <TextInput
            label="Email"
            withAsterisk
            placeholder="johndoe@gmail.com"
            {...getInputProps("email")}
          />
          <NumberInput
            decimalSeparator="."
            label="Commission (%)"
            defaultValue={10}
            precision={2}
            max={100}
            step={0.01}
            {...getInputProps("commission_percentage")}
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
