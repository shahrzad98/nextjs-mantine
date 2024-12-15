import { getPromotersList } from "@/api/handler";
import { isHttpError } from "@/types";
import { emailRegex, errorNotification, promotersKey } from "@/utils";
import { SegmentedControl, Text } from "@mantine/core";
import { Autocomplete, NumberInput } from "@mantine/core";
import { Modal, rem, Title, Button, ModalProps, Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

function useGetAllPromoters() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [promotersKey],
    queryFn: async () => getPromotersList().then((res) => res.data),
    initialData: queryClient.getQueryData([promotersKey]),
  });
}

interface IInvitePromotersModalProps extends ModalProps {
  onModalSubmit: ({
    email,
    commission_amount,
    commission_type,
    promoter_id,
  }: {
    email: string;
    commission_amount: number;
    commission_type: string;
    promoter_id: string;
  }) => void;
  submitLoading?: boolean;
}

export const InvitePromoterModal = ({
  onModalSubmit,
  submitLoading,
  ...props
}: IInvitePromotersModalProps) => {
  const { data: promoters = [], isError: isLoadingPromotersError } = useGetAllPromoters();

  useEffect(() => {
    if (isHttpError(isLoadingPromotersError)) {
      errorNotification(isLoadingPromotersError);
    }
  }, [isLoadingPromotersError]);

  const { getInputProps, isDirty, onSubmit, reset, setFieldValue, values } = useForm({
    initialValues: {
      promoter_id: "",
      email: "",
      commission_type: "percentage",
      commission_amount: 0,
    },

    validate: {
      email: (value) =>
        emailRegex.test(value)
          ? null
          : value.length > 0
          ? "Invalid Email."
          : "Email can't be empty.",
      commission_amount: (value, values) =>
        values.commission_type === "percentage" && value < 0
          ? "Commission Percentage is not Valid"
          : values.commission_type === "amount" && value < 0
          ? "Commission Amount is not Valid"
          : null,
    },
  });

  const handleSubmit = (values: {
    promoter_id: string;
    email: string;
    commission_amount: number;
    commission_type: string;
  }) => {
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
        mb={rem(11)}
        align="center"
        color="#FFFFFFCC"
        fw={600}
      >
        Add Promoter
      </Title>
      <form onSubmit={onSubmit((values) => handleSubmit(values))}>
        <Stack spacing={rem(14)} px={rem(9)}>
          <Autocomplete
            withAsterisk
            label="Username/Email"
            data={promoters.map((item) => item.email)}
            onItemSubmit={(e) =>
              setFieldValue(
                "promoter_id",
                promoters.find((item) => item.email === e.value)?.id as string
              )
            }
            placeholder="Username or email"
            {...getInputProps("email")}
          />
          <Text fz={rem(14)} fw={500}>
            Commission{" "}
            <Text span c={"#E03130"}>
              *
            </Text>
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
