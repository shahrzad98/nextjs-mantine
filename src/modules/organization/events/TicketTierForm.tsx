import { ITicketTierRequest, ITicketTierResponse } from "@/types/ticket";
import { generateDayJsDate } from "@/utils";
import { Button, Grid, Group, NumberInput, rem, Text, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";

interface ITicketTierFormProps {
  submitText?: string;
  onSubmit: (values: ITicketTierRequest) => void;
  onClose?: () => void;
  initialValue?: ITicketTierResponse;
  submitLoading?: boolean;
  isEdit: boolean;
  timezoneUtcOffset: number;
}

interface IFormValues {
  [key: string]: any;
}

interface IEventDate {
  start_at: Date | null;
  end_at: Date | null;
  start_time: string | null;
  end_time: string | null;
}

export const TicketTierForm = ({
  submitText,
  onSubmit,
  onClose,
  initialValue,
  submitLoading,
  isEdit,
  timezoneUtcOffset,
}: ITicketTierFormProps) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(isSameOrAfter);

  const TIER_NAME_MAX_LENGTH = 20;
  const DESCRIPTION_MAX_LENGTH = 1000;
  const [eventDate, setEventDate] = useState<IEventDate>({
    start_at: null,
    end_at: null,
    start_time: null,
    end_time: null,
  });

  const form = useForm<IFormValues>({
    initialValues: {
      name: "",
      description: "",
      price: 1,
      ticket_quantity: 0,
      seats: 1,
      start_at: "",
      end_at: "",
      start_time: "",
      end_time: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters long" : null,
      price: (value) => (1 > value ? "Ticket price can't be less than 1$" : null),
      ticket_quantity: (value) => (value === 0 ? "Ticket quantity can't be 0" : null),
      seats: (value) => (value === 0 ? "Number of Seats can't be less than 1" : null),
      start_at: (value) => (!value ? "Select a valid date range" : null),
      end_at: (value) => (!value ? "Select a valid date range" : null),
      start_time: (value) => {
        return !value ? "Select a valid time" : null;
      },
      end_time: (value) => {
        return !value ? "Select a valid time" : null;
      },
    },

    transformValues: (values) => {
      const dateStart = generateDayJsDate(
        values.start_at,
        values.start_time,
        timezoneUtcOffset
      ).toISOString();

      const dateEnd = generateDayJsDate(
        values.end_at,
        values.end_time,
        timezoneUtcOffset
      ).toISOString();

      return {
        ...values,
        start_at: dateStart,
        end_at: dateEnd,
      };
    },
  });

  const getStartEndValues = (start: string, end: string) => {
    const startAt = dayjs.utc(start).add(timezoneUtcOffset, "second");
    const startTime = startAt.format("HH:mm");
    const endAt = dayjs.utc(end).add(timezoneUtcOffset, "second");
    const endTime = endAt.format("HH:mm");

    return {
      start_at: new Date(startAt.get("year"), startAt.get("month"), startAt.date()),
      end_at: new Date(endAt.get("year"), endAt.get("month"), endAt.date()),
      start_time: startTime,
      end_time: endTime,
    };
  };

  useEffect(() => {
    if (initialValue) {
      const eventDates = getStartEndValues(
        initialValue?.event?.start_at as string,
        initialValue?.event?.end_at as string
      );
      setEventDate(eventDates);
      if (isEdit) {
        const initialValues = {
          ...initialValue,
          ...getStartEndValues(initialValue.start_at, initialValue.end_at),
        };

        form.setValues(initialValues);
        form.resetDirty(initialValues);
      } else {
        const initialValues = {
          ...form.values,
          ...getStartEndValues(initialValue?.event?.start_at, initialValue?.event?.end_at),
        };

        form.setValues(initialValues);
        form.resetDirty(initialValues);
      }
    }
  }, [initialValue]);

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <TextInput
        withAsterisk
        label="Customize Tier Name?"
        mt={rem(12)}
        maxLength={TIER_NAME_MAX_LENGTH}
        {...form.getInputProps("name")}
      />
      <Text size={rem(10)} mt={2} color="rgba(255, 255, 255, 0.50)">
        {form.values?.name?.length || 0}/{TIER_NAME_MAX_LENGTH} Characters
      </Text>
      <DatePickerInput
        dropdownType="modal"
        label="Start Date and End Date"
        placeholder="Select Date"
        withAsterisk
        value={[form.values?.start_at, form.values?.end_at]}
        onChange={(e) => {
          form.setFieldValue("start_at", e[0]);
          form.setFieldValue("end_at", e[1]);
        }}
        styles={{
          input: {
            height: 40,
            background: "#282B3D",
            borderColor: "#1E2130",
          },
        }}
        allowSingleDateInRange
        minDate={eventDate.start_at as Date}
        maxDate={eventDate.end_at as Date}
        type="range"
        mx="auto"
        mb={rem(25)}
        mt={rem(15)}
        numberOfColumns={2}
        error={
          form.errors.start_at
            ? form.errors.start_at
            : form.errors.end_at
            ? form.errors.end_at
            : null
        }
      />

      <Grid gutter={rem(12)}>
        <Grid.Col span={12} md={6}>
          <TimeInput
            label="Start Time"
            withAsterisk
            {...form.getInputProps("start_time")}
            styles={{
              input: {
                height: 40,
              },
            }}
          />
        </Grid.Col>
        <Grid.Col span={12} md={6}>
          <TimeInput
            label="End Time"
            withAsterisk
            {...form.getInputProps("end_time")}
            styles={{
              input: {
                height: 40,
              },
            }}
          />
        </Grid.Col>
      </Grid>

      <Textarea
        withAsterisk
        label="Description"
        minRows={3}
        mt={rem(15)}
        maxLength={DESCRIPTION_MAX_LENGTH}
        {...form.getInputProps("description")}
      />
      <Text size={rem(10)} mt={2} color="rgba(255, 255, 255, 0.50)">
        {form.values?.description?.length || 0}/{DESCRIPTION_MAX_LENGTH} Characters | Minimum 10
        characters
      </Text>

      <NumberInput
        label={`Price (${process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"} $)`}
        withAsterisk
        defaultValue={0}
        precision={2}
        min={1}
        step={0.01}
        mt={rem(12)}
        {...form.getInputProps("price")}
      />

      <NumberInput
        label="Ticket Quantity"
        withAsterisk
        defaultValue={0}
        min={0}
        mt={rem(12)}
        {...form.getInputProps("ticket_quantity")}
      />

      <NumberInput
        label="Seat Quantity"
        withAsterisk
        defaultValue={0}
        min={0}
        mt={rem(12)}
        {...form.getInputProps("seats")}
      />

      <Group position="center" mt={rem(35)} spacing={rem(25)}>
        <Button variant="outline" onClick={onClose} fw={300} h={44}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="gradient"
          gradient={{ from: "#3077F3", to: "#15AABF" }}
          fw={300}
          h={44}
          disabled={!form.isDirty()}
          loading={submitLoading}
        >
          {submitText}
        </Button>
      </Group>
    </form>
  );
};
