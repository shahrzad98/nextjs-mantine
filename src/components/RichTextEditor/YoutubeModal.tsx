import { youtubeVideoUrlRegex } from "@/utils";
import { Modal, rem, Title, Button, ModalProps, Flex, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface IYoutubeModalProps extends ModalProps {
  onModalSubmit: (src: string) => void;
}

export const YoutubeModal = ({ onModalSubmit, ...props }: IYoutubeModalProps) => {
  const { getInputProps, isDirty, values, reset, validate } = useForm({
    initialValues: {
      src: "",
    },

    validate: {
      src: (value) =>
        youtubeVideoUrlRegex.test(value)
          ? null
          : value.trim().length > 0
          ? "Please enter a valid Youtube URL."
          : "SRC can't be empty.",
    },
  });

  const handleSubmit = () => {
    const { hasErrors } = validate();
    if (!hasErrors) {
      onModalSubmit(values.src);
      reset();
      props.onClose();
    }
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
        Insert Video
      </Title>
      <Stack spacing={rem(14)} px={rem(8)}>
        <TextInput
          label="SRC"
          withAsterisk
          placeholder="https://www.youtube.com/watch?v=ScMzIvxBSi4"
          {...getInputProps("src")}
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
          onClick={handleSubmit}
          sx={{
            "&[data-disabled]": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
          }}
        >
          Insert
        </Button>
      </Flex>
    </Modal>
  );
};
