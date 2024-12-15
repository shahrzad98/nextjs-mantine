import { updateEventPromoter } from "@/api/handler";
import { eventPromotersKey, organizationPromoterEventsKey, successNotification } from "@/utils";
import { SegmentedControl, Text } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { Modal, rem, Title, Button, ModalProps, Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export interface IUpdatePromoterProps {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  commission_amount: number;
  commission_type: string;
  event_id: string;
}

interface IUpdatePromotersModalProps extends ModalProps {
  promoter: IUpdatePromoterProps;
}

function useUpdatePromoter(close: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promoter) =>
      updateEventPromoter({
        eventId: promoter.event_id,
        promoterId: promoter.id,
        commission_amount: promoter.commission_amount as number,
        commission_type: promoter.commission_type,
      }).then((res) => res.data),
    onMutate: (newPromoter: IUpdatePromoterProps) => {
      queryClient.setQueryData(
        [eventPromotersKey],
        (prevPromoters: IUpdatePromoterProps[] | undefined) =>
          prevPromoters?.map((prevPromoter: IUpdatePromoterProps) =>
            prevPromoter.id === prevPromoter.id ? newPromoter : prevPromoter
          )
      );
    },
    onSuccess: (_response, variables) => {
      successNotification({
        title: `Commission amount successfully updated for ${
          variables.first_name ? `${variables.first_name} ${variables.last_name}` : variables?.email
        }.`,
        message: "Future events created by the organization will reflect the new rate.",
      });
      queryClient.invalidateQueries({ queryKey: [eventPromotersKey] });
      queryClient.invalidateQueries({ queryKey: [organizationPromoterEventsKey] });
      close();
    },
  });
}

export const UpdatePromoterModal = ({ promoter, ...props }: IUpdatePromotersModalProps) => {
  const { getInputProps, isDirty, onSubmit, reset, values } = useForm({
    initialValues: {
      commission_type: promoter?.commission_type,
      commission_amount: promoter?.commission_amount || 0,
    },

    validate: {
      commission_amount: (value) =>
        value >= 6 ? null : "Commission Percentage Should Not Be Less Than 6%",
    },
  });

  const { mutateAsync: updatePromoter, isLoading: isUpdatingPromoter } = useUpdatePromoter(
    props.onClose
  );

  const handleClose = () => {
    reset();
    props.onClose();
  };

  useEffect(() => {
    reset();
  }, []);

  console.log(promoter);

  return (
    <Modal
      withCloseButton={false}
      centered
      size={rem(356)}
      styles={{ content: { backgroundColor: "#282b3d" } }}
      zIndex={9999}
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
        Update Commission
      </Title>
      <form onSubmit={onSubmit((values) => updatePromoter({ ...promoter, ...values }))}>
        <Stack spacing={rem(14)} px={rem(9)}>
          <Text fz={rem(14)} fw={500}>
            Commission
          </Text>
          <SegmentedControl
            data={[
              { label: "Percentage", value: "percentage" },
              { label: "Fixed Amount", value: "amount" },
            ]}
            {...getInputProps("commission_type")}
          />

          <NumberInput
            decimalSeparator="."
            defaultValue={10}
            icon={values.commission_type === "percentage" ? "%" : "$"}
            iconWidth={36}
            max={values.commission_type === "percentage" ? 100 : undefined}
            step={1}
            {...getInputProps("commission_amount")}
          />
          <Text fw={400} fz={rem(10)} c={"#FFFFFF80"}>
            A commission applies to each attendee&apos;s ticket purchase
          </Text>
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
            loading={isUpdatingPromoter}
            sx={{
              "&[data-disabled]": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
            }}
          >
            Update
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};
