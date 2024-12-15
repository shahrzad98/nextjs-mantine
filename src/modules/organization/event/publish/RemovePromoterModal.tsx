import { removeEventPromoter, removeOrganizationPromoter } from "@/api/handler";
import { CustomErrorResponse } from "@/types";
import {
  errorNotification,
  eventPromotersKey,
  organizationPromotersKey,
  successNotification,
} from "@/utils";
import { Text } from "@mantine/core";
import { Modal, rem, Title, Button, ModalProps, Stack } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface IRemovePromotersModalProps extends ModalProps {
  promoterId: string;
  promoterName: string;
  eventId?: string;
  type: "event" | "organization";
}

export const RemovePromoterModal = ({
  promoterName,
  promoterId,
  type,
  eventId,
  ...props
}: IRemovePromotersModalProps) => {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteEventPromoter, isLoading: deleteEventPromoterLoading } = useMutation(
    () => removeEventPromoter({ eventId: eventId as string, promoterId }).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [eventPromotersKey] });

        successNotification({
          title: "Successful",
          message: "Promoter Successfully Removed.",
        });

        handleClose();
      },
    }
  );

  const { mutate: handleDeleteOrganizationPromoter, isLoading: deleteOrganizationPromoterLoading } =
    useMutation(() => removeOrganizationPromoter(promoterId).then((res) => res.data), {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [organizationPromotersKey] });

        successNotification({
          title: "Successful",
          message: "Promoter Successfully Removed.",
        });
        handleClose();
      },
    });

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal
      withCloseButton={false}
      centered
      size={rem(382)}
      zIndex={9999}
      styles={{
        content: { backgroundColor: "#282b3d" },
        body: {
          padding: "0 22px",
        },
      }}
      {...props}
      onClose={handleClose}
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
        Remove Promoter
      </Title>
      <Text c="rgba(255, 255, 255, 0.70)" align="center" fz={rem(14)} fw={300} lts="-0.28px">
        Are you sure you want to remove {promoterName}? This action is irreversible and will remove
        them from all associated events.
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
          loading={
            type === "event" ? deleteEventPromoterLoading : deleteOrganizationPromoterLoading
          }
          onClick={() =>
            type === "event" ? handleDeleteEventPromoter() : handleDeleteOrganizationPromoter()
          }
        >
          Remove
        </Button>
        <Button
          variant="outline"
          fullWidth
          maw={rem(266)}
          h={rem(44)}
          fz={rem(15)}
          fw={400}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Stack>
    </Modal>
  );
};
