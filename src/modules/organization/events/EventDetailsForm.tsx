import {
  cancelEvent,
  createEvent,
  deleteEvent,
  editEvent,
  getEvent,
  getTimezones,
  publishEvent,
} from "@/api/handler";
import { getLocationsList, getReverseLocation } from "@/api/handler/location";
import NoSsr from "@/common/NoSsr";
import { useBreakpoint } from "@/hooks";
import { StripeSetupModal } from "@/modules";
import userStore from "@/stores/userStore";
import { CustomErrorResponse, IMyEvent, isHttpError } from "@/types";
import {
  atLeastOneAlphanumericRegex,
  emailRegex,
  generateDayJsDate,
  getChangedFormValues,
  locationIsAccurate,
  normalizeMaskedNumber,
  successNotification,
} from "@/utils";
import { errorNotification } from "@/utils";
import { eventKey, locationKey, reverseLocationKey, timezonesKey } from "@/utils/queryKeys";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Input,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

import {
  PhoneNumberInput,
  RichTextEditor,
  OrganizerDashboardLayout,
  LocationAutocomplete,
  NovelTHead,
} from "@/components";
import { ILocationAutocompleteItem } from "@/components/LocationAutocomplete";

import categoriesData from "./categoriesData.json";
import { EventImageUploader } from "./EventImageUploader";

const LeafletLocationPickerMap = dynamic(() => import("@/components/LeafletLocationPickerMap"), {
  ssr: false,
});

interface IEventDetailsFormProps {
  variant: "create" | "edit" | "summary";
  status?: string;
}

interface IFormValues {
  primary_image: File | string | null;

  [key: string]: any;
}

const mobileActionProps = {
  mt: rem(30),
  bottom: 0,
  left: 0,
  p: rem(16),
  bg: "#25262B",
  w: "100%",
  sx: {
    display: "flex",
    justifyContent: "center",
  },
};

export const EventDetailsForm = ({ variant, status }: IEventDetailsFormProps) => {
  const router = useRouter();

  const { id } = router.query;

  const { isMobile, isTablet } = useBreakpoint();

  const theme = useMantineTheme();

  const [opened, { open, close }] = useDisclosure(false);
  const [stripeSetupOpened, { open: openStripeSetup }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  const currentUser = userStore((state) => state.currentUser);
  const stripeIsActive = currentUser?.data?.organization?.active;

  useEffect(() => {
    if (!!currentUser && !stripeIsActive) {
      openStripeSetup();
    }
  }, [currentUser, openStripeSetup, stripeIsActive]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 200);
  const [selectedLocation, setSelectedLocation] =
    useState<Partial<ILocationAutocompleteItem> | null>(null);
  const [mapCenter, setMapCenter] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });

  const [isSummary, setIsSummary] = useState(variant === "summary");
  const [isEdit, setIsEdit] = useState(variant === "edit");
  const isCreate = variant === "create";

  const handleBack = () => {
    router.back();
  };

  const { values, onSubmit, getInputProps, setFieldValue, setValues, resetDirty, isDirty, errors } =
    useForm<IFormValues>({
      initialValues: {
        name: "",
        description: "",
        category: "",
        genre: "",
        message_to_attendee: "",
        country: "",
        province_state: "",
        city: "",
        address: "",
        lat: 0,
        lng: 0,
        zip_pc: "",
        primary_image: null,
        start_at: "",
        end_at: "",
        start_time: "",
        end_time: "",
        contact_email: "",
        contact_phone: "",
        country_code: "1",
        is_private: false,
        time_zone: "",
      },

      validate: {
        category: (value) => (value.length < 2 ? "Select a category" : null),
        genre: (value, values) =>
          value?.length < 2 && values.category === "music" ? "Select a genre" : null,
        name: (value) =>
          value.trim().length < 2
            ? "Name must have at least 2 letters"
            : atLeastOneAlphanumericRegex.test(value)
            ? null
            : "Name should contain at least one alphanumeric character",
        description: (value) => (value.length < 15 ? "ِDescription should be longer" : null),
        contact_email: (value) => (emailRegex.test(value) || !value ? null : "Invalid email"),
        contact_phone: (value) =>
          /^\d{10}$/.test(normalizeMaskedNumber(value)) || !normalizeMaskedNumber(value)
            ? null
            : "Invalid Phone Number",
        address: (value) => (value.length < 2 ? "Please select a more detailed address." : null),
        message_to_attendee: (value) =>
          isSummary && isDateDirty && (!value || value?.length < 9)
            ? "Message to Attendees should be longer"
            : null,
        primary_image: (value) => (!value ? "Select a valid image" : null),
        time_zone: (value) => (!value ? "Select a valid timezone" : null),
        start_at: (value) => (!value ? "Select a valid date range" : null),
        end_at: (value) => (!value ? "Select a valid date range" : null),
        start_time: (value, values) => {
          const timezoneOffset = timezonesData?.find(
            (tz) => tz.name === values.time_zone
          )?.utc_offset;

          const dateStart = generateDayJsDate(values.start_at, values.start_time, timezoneOffset);

          const currentTime = dayjs.utc();

          return !value
            ? "Select a valid time"
            : currentTime.isSameOrAfter(dateStart)
            ? "Start time can't be in the past."
            : null;
        },
        end_time: (value, values) => {
          const timezoneOffset = timezonesData?.find(
            (tz) => tz.name === values.time_zone
          )?.utc_offset;

          const dateStart = generateDayJsDate(values.start_at, values.start_time, timezoneOffset);

          const dateEnd = generateDayJsDate(values.end_at, values.end_time, timezoneOffset);

          return !value
            ? "Select a valid time"
            : dateStart.isSameOrAfter(dateEnd)
            ? "End time can't be before start time."
            : null;
        },
      },

      transformValues: (values) => {
        const timezoneOffset = timezonesData?.find(
          (tz) => tz.name === values.time_zone
        )?.utc_offset;

        const dateStart = generateDayJsDate(
          values.start_at,
          values.start_time,
          timezoneOffset
        ).toISOString();

        const dateEnd = generateDayJsDate(
          values.end_at,
          values.end_time,
          timezoneOffset
        ).toISOString();

        return {
          ...values,
          contact_phone: normalizeMaskedNumber(values.contact_phone),
          start_at: dateStart,
          end_at: dateEnd,
        };
      },
    });
  const isDateDirty =
    isDirty("start_at") || isDirty("end_at") || isDirty("start_time") || isDirty("end_time");
  const handleSearch = (val: string) => {
    setSearchValue(val);
  };
  const handleLocationSelect = useCallback(
    (selectedLocation: ILocationAutocompleteItem) => {
      if (locationIsAccurate(selectedLocation)) {
        setSelectedLocation(selectedLocation);
        setSearchValue(selectedLocation?.properties?.label ?? "");
        setFieldValue("address", selectedLocation?.properties?.name as string);
        setFieldValue("country", selectedLocation?.properties?.country as string);
        setFieldValue("province_state", selectedLocation?.properties?.region as string);
        setFieldValue(
          "city",
          (selectedLocation?.properties?.locality ?? selectedLocation?.properties?.county) as string
        );
        setFieldValue("lng", selectedLocation?.geometry.coordinates[0]);
        setFieldValue("lat", selectedLocation?.geometry.coordinates[1]);
      } else {
        errorNotification({
          title: "Error",
          message: "Please select a more detailed address.",
        });
      }
    },
    [setFieldValue]
  );

  const {
    data: timezonesData,
    isSuccess: timezonesIsSuccess,
    error: timezonesError,
  } = useQuery([timezonesKey], () => getTimezones().then((res) => res.data), {
    retry: false,
  });

  useEffect(() => {
    if (isHttpError(timezonesError)) {
      errorNotification(timezonesError as AxiosError);
    }
  }, [timezonesError]);

  const {
    data: eventData,
    isSuccess: eventIsSuccess,
    error: eventError,
  } = useQuery([eventKey(id as string)], () => getEvent(id as string).then((res) => res.data), {
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (isHttpError(eventError)) {
      errorNotification(eventError as AxiosError);
    }
  }, [eventError]);

  useEffect(() => {
    if (eventIsSuccess && timezonesIsSuccess) {
      const timezone = timezonesData?.find((tz) => tz.name === eventData?.time_zone?.name);
      const startAt = dayjs.utc(eventData.start_at).add(timezone?.utc_offset as number, "second");
      const startTime = startAt.format("HH:mm");
      const endAt = dayjs.utc(eventData.end_at).add(timezone?.utc_offset as number, "second");
      const endTime = endAt.format("HH:mm");
      const countryCode = eventData?.contact_phone?.split("-")[0] || "1";
      const phoneNumber = eventData?.contact_phone?.split("-")[1] || "";

      const initialValues = {
        ...eventData,
        start_at: new Date(startAt.get("year"), startAt.get("month"), startAt.date()),
        end_at: new Date(endAt.get("year"), endAt.get("month"), endAt.date()),
        start_time: startTime,
        end_time: endTime,
        country_code: countryCode,
        contact_phone: phoneNumber,
        time_zone: timezone?.name,
      };
      setValues(initialValues);
      resetDirty(initialValues);

      const { lat, lng, address, city, province_state, country } = eventData;

      if (!!lat && !!lng) {
        setSelectedLocation({
          geometry: {
            coordinates: [lng, lat],
          },
        });
      }
      if (!!address && !!city && !!province_state && !!country) {
        setSearchValue(`${address}, ${city}, ${province_state}, ${country}`);
      }
    }
    if (eventData?.status === "published" || eventData?.status === "rescheduled") {
      setIsSummary(true);
      setIsEdit(false);
    }
  }, [eventData, eventIsSuccess, setValues]);

  const {
    data: reverseLocationData,
    isSuccess: reverseLocationIsSuccess,
    isFetching: reverseLocationIsFetching,
    error: reverseLocationError,
  } = useQuery(
    [reverseLocationKey, mapCenter.lat, mapCenter.lng],
    () =>
      getReverseLocation(mapCenter.lat as number, mapCenter.lng as number).then(
        (res) => res?.data?.features
      ),
    {
      enabled: !!mapCenter.lat && !!mapCenter.lng,
      retry: false,
    }
  );

  useEffect(() => {
    if (isHttpError(reverseLocationError)) {
      errorNotification(reverseLocationError as AxiosError);
    }
  }, [reverseLocationError]);

  useEffect(() => {
    if (reverseLocationIsSuccess) {
      const value =
        reverseLocationData && reverseLocationData[0]
          ? reverseLocationData[0].properties?.label
          : "Address not found";
      handleLocationSelect({
        ...reverseLocationData[0],
        value: value ?? "",
      });
    }
  }, [handleLocationSelect, reverseLocationData, reverseLocationIsSuccess]);

  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    setMapCenter(latlng);
  };

  const {
    data: locationsData,
    isSuccess: locationsIsSuccess,
    isFetching: locationsIsFetching,
  } = useQuery(
    [locationKey, debouncedSearchValue],
    () =>
      isSummary
        ? getLocationsList(debouncedSearchValue, eventData?.lat, eventData?.lng).then(
            (res) => res?.data?.features
          )
        : getLocationsList(debouncedSearchValue).then((res) => res?.data?.features),
    {
      enabled:
        debouncedSearchValue?.trim()?.length > 2 &&
        (reverseLocationIsSuccess
          ? reverseLocationData[0].properties?.label !== searchValue
          : true),
    }
  );

  const { mutate: handleCreateEvent, isLoading: createEventLoading } = useMutation(
    (formValues: FormData) => createEvent(formValues).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: (res) => {
        router.push(`/organization/create-event/${res.id}/ticket-tiers`);
      },
    }
  );

  const { mutate: handleEditEvent, isLoading: editEventLoading } = useMutation(
    (formValues: FormData) =>
      editEvent({ eventId: id as string, eventData: formValues }).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: (res) => {
        isDateDirty && (status === "published" || status === "rescheduled")
          ? successNotification({
              title: "Event Rescheduled Successfully.",
              message:
                "All attendees have been notified by text message and email with your included message.",
            })
          : successNotification({ message: "Event updated successfully." });
        router.push(`/organization/event/${res.id}`);
      },
    }
  );

  const { mutate: handleCancelEvent } = useMutation(
    () => cancelEvent(id as string).then((res) => res.data),
    {
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
      onSuccess: () => {
        successNotification({ title: "Successful", message: "Event is canceled" });
        router.push(`/organization/my-events`);
      },
    }
  );

  const { mutate: handleDeleteEvent } = useMutation(() => deleteEvent(id as string), {
    onSuccess: () => {
      successNotification({ title: "Successful", message: "Event Successfully Deleted" });
      router.push("/organization/my-events");
    },
    onError: (error: AxiosError<CustomErrorResponse>) => {
      errorNotification(error);
    },
  });

  const { mutate: handlePublishEvent } = useMutation(
    () => publishEvent(id as string, { event: { ...eventData, ...values } as IMyEvent }),
    {
      onSuccess: () => {
        successNotification({ title: "Successful", message: "Event Successfully Published" });
        router.push("/organization/my-events");
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );

  const isPublishable =
    eventData?.ticket_tiers.some((t: { ticket_quantity: number }) => t.ticket_quantity > 0) &&
    !["done", "canceled"].includes(eventData?.status);

  const handleSubmit = (entries: Partial<IFormValues>) => {
    const formData = new FormData();
    if (isDateDirty) {
      formData.append("status", "rescheduled");
    }

    if (isCreate) {
      Object.entries(entries).forEach(([key, value]) => {
        if (key === "contact_phone") {
          formData.append(key, `${values.country_code}-${value}`);
        } else if (
          (value && key !== "country_code" && key !== "start_time" && key !== "end_time") ||
          key === "is_private"
        ) {
          formData.append(key, value);
        }
      });
      handleCreateEvent(formData);
    } else {
      const timezoneOffset = timezonesData?.find((tz) => tz.name === entries.time_zone)?.utc_offset;
      const dateTimeKeys = ["start_time", "start_at", "end_time", "end_at", "time_zone"];
      Object.entries(entries).forEach(([key, value]) => {
        if (key === "contact_phone") {
          formData.append(key, value ? `${values.country_code}-${value}` : "");
        } else if (key === "country_code" && !entries.contact_phone) {
          formData.append("contact_phone", `${value}-${values.contact_phone}`);
        } else if (dateTimeKeys.includes(key)) {
          formData.append(
            "start_at",
            generateDayJsDate(values.start_at, values.start_time, timezoneOffset).toISOString()
          );
          formData.append(
            "end_at",
            generateDayJsDate(values.end_at, values.end_time, timezoneOffset).toISOString()
          );
          if (key === "time_zone") {
            formData.append("time_zone", value);
          }
        } else if (
          key !== "country_code" &&
          key !== "status" &&
          !(key === "primary_image" && typeof value === "string")
        ) {
          if (key === "is_private") {
            formData.append(key, value);
          } else {
            formData.append(key, value ? (value as string) : "");
          }
        }
      });

      handleEditEvent(formData);
    }
  };

  const Actions = () => (
    <>
      {isSummary ? (
        <>
          <Button
            h={isTablet ? undefined : rem(44)}
            w={isTablet ? "calc(60% - 10px)" : undefined}
            size={isMobile ? "sm" : "md"}
            variant="gradient"
            gradient={{ deg: 45, from: "#3077F3", to: "#15AABF" }}
            fz={rem(isTablet ? 12 : 15)}
            fw={"400"}
            fullWidth={isTablet}
            type="submit"
            disabled={!isDirty()}
            loading={editEventLoading}
            px={isMobile ? 0 : undefined}
            sx={{
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.30)",
                color: "#9DA1A4",
              },
            }}
          >
            Save & Update Event
          </Button>
          <Button
            h={isTablet ? undefined : rem(44)}
            w={isTablet ? "calc(40% - 10px)" : undefined}
            size={isMobile ? "sm" : "md"}
            color="red"
            c="#E03130"
            sx={{ borderColor: "#E03130" }}
            variant="outline"
            px={isMobile ? 0 : undefined}
            fz={rem(isTablet ? 12 : 15)}
            fw={"600"}
            onClick={() => open()}
          >
            Cancel Event
          </Button>
        </>
      ) : isEdit ? (
        <>
          <Button
            size={isMobile ? "sm" : "md"}
            h={isTablet ? undefined : rem(44)}
            w={isTablet ? "100%" : undefined}
            variant="gradient"
            gradient={{ deg: 45, from: "#3077F3", to: "#15AABF" }}
            fz={rem(isTablet ? 12 : 15)}
            fw={"400"}
            type="submit"
            loading={editEventLoading}
            disabled={!isDirty()}
            px={isMobile ? 0 : undefined}
            sx={{
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.30)",
                color: "#9DA1A4",
              },
            }}
          >
            Save
          </Button>

          <Button
            h={isTablet ? undefined : rem(44)}
            w={isTablet ? "calc(50% - 10px)" : undefined}
            size={isMobile ? "sm" : "md"}
            variant="outline"
            color="red"
            styles={{
              root: {
                borderColor: "#E03130",
              },
            }}
            c="#E03130"
            fz={rem(isTablet ? 12 : 15)}
            fw={"600"}
            onClick={openDelete}
            px={isMobile ? 0 : undefined}
            sx={{
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.30)",
                color: "#9DA1A4",
              },
            }}
          >
            Delete Event
          </Button>
          <Button
            h={isTablet ? undefined : rem(44)}
            w={isTablet ? "calc(50% - 10px)" : undefined}
            size={isMobile ? "sm" : "md"}
            variant="outline"
            fz={rem(isTablet ? 12 : 15)}
            fw={"600"}
            onClick={() => handlePublishEvent()}
            disabled={!isPublishable}
            px={isMobile ? 0 : undefined}
            sx={{
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.30)",
                color: "#9DA1A4",
              },
            }}
          >
            Publish
          </Button>
        </>
      ) : (
        <>
          <Button
            size={isMobile ? "sm" : "md"}
            h={isTablet ? undefined : rem(44)}
            w={isTablet ? "calc(60% - 10px)" : undefined}
            variant="gradient"
            gradient={{ deg: 45, from: "#3077F3", to: "#15AABF" }}
            fz={rem(isTablet ? 12 : 15)}
            fw={"400"}
            type="submit"
            loading={createEventLoading}
            disabled={!isDirty()}
            px={isMobile ? 0 : undefined}
            sx={{
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.30)",
                color: "#9DA1A4",
              },
            }}
          >
            Save as Draft & Continue
          </Button>
          <Button
            h={isTablet ? undefined : rem(44)}
            w={isTablet ? "calc(40% - 10px)" : undefined}
            size={isMobile ? "sm" : "md"}
            variant="outline"
            px={isMobile ? 0 : undefined}
            fz={rem(isTablet ? 12 : 15)}
            fw={"600"}
            onClick={handleBack}
          >
            Cancel
          </Button>
        </>
      )}
    </>
  );

  return (
    <NoSsr>
      <OrganizerDashboardLayout
        navbarProps={{
          currentPageTitle: isCreate
            ? "Create New Event"
            : isEdit
            ? "Edit Event"
            : "Edit Published Event",
        }}
      >
        <NovelTHead title={isCreate ? "Basic Info" : isEdit ? "Edit Event" : "Event Preview"} />
        <form onSubmit={onSubmit((values) => handleSubmit(getChangedFormValues(values, isDirty)))}>
          <Container
            size={!isTablet ? rem(1186) : "xs"}
            mih={"75vh"}
            mb={rem(80)}
            mt={isTablet ? rem(80) : undefined}
          >
            {!isTablet && (
              <Flex justify={"space-between"} align={"center"} mt={rem(20)} mb={rem(67)}>
                <Title size={rem(24)} fw={"500"} color="rgba(255, 255, 255, 0.8)">
                  {isCreate && "Create New Event"}
                  {isEdit && `Edit Event (${status?.toUpperCase()})`}
                  {isSummary && "Summary"}
                </Title>
                <Group spacing={12}>
                  <Actions />
                </Group>
              </Flex>
            )}
            <Grid gutter={isTablet ? 32 : 70} px={isTablet ? rem(20) : rem(60)}>
              <Grid.Col md={4} lg={4} xs={12}>
                <Divider
                  mb={rem(31)}
                  label="Basic Info"
                  labelProps={{ size: "14px", color: "#FFF" }}
                />

                <TextInput
                  placeholder="Name of the event"
                  label="Event Name"
                  withAsterisk
                  mb={rem(25)}
                  {...getInputProps("name")}
                />

                <Input.Wrapper
                  withAsterisk
                  label={"Description"}
                  error={errors?.description}
                  pos="relative"
                  sx={{ zIndex: 0 }}
                >
                  {(eventIsSuccess || isCreate) && (
                    <RichTextEditor
                      value={values.description}
                      setValue={(newValue) => setFieldValue("description", newValue)}
                      limit={2000}
                    />
                  )}
                </Input.Wrapper>

                <Select
                  label="Category"
                  placeholder="Select Category"
                  withAsterisk
                  data={categoriesData.eventCategories}
                  mb={rem(25)}
                  mt={rem(25)}
                  {...getInputProps("category")}
                />

                {values.category === "music" && (
                  <Select
                    label="Music Genre"
                    placeholder="Select Genre"
                    withAsterisk
                    data={categoriesData.musicGenres}
                    mb={rem(25)}
                    mt={rem(25)}
                    {...getInputProps("genre")}
                  />
                )}
                {!isTablet && (
                  <>
                    <EventImageUploader
                      file={values.primary_image}
                      onChange={(file) => setFieldValue("primary_image", file)}
                      error={errors?.primary_image}
                    />
                    <Text size={rem(10)} fw={"300"} lh={rem(17)} color="rgba(255, 255, 255, 0.6)">
                      1. Supported File Formats (PNG, JPEG) <br />
                      2. Recommended Ratio (1500 x 500px) <br />
                      3. File Size Limits: 3 MB or less. <br />
                    </Text>
                  </>
                )}
              </Grid.Col>
              <Grid.Col md={4} lg={4} xs={12}>
                <Divider
                  mb={rem(31)}
                  label="Location"
                  labelProps={{ size: "14px", color: "#FFF" }}
                />
                <LocationAutocomplete
                  mb={rem(25)}
                  data={
                    locationsIsSuccess
                      ? locationsData.map((location) => ({
                          ...location,
                          value: location?.properties?.label ?? "",
                        }))
                      : []
                  }
                  isFetching={locationsIsFetching}
                  value={searchValue}
                  onChange={handleSearch}
                  itemComponent={(locationItem: ILocationAutocompleteItem) => (
                    <Fragment key={locationItem.properties?.id}>
                      <Text
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleLocationSelect(locationItem)}
                      >
                        {locationItem.properties?.label}
                      </Text>
                      <Divider />
                    </Fragment>
                  )}
                  nothingFound={
                    !locationsIsFetching && locationsIsSuccess ? (
                      <Text>No results found</Text>
                    ) : null
                  }
                  error={errors.address}
                />
                <TextInput
                  placeholder="Your Zip/Postal Code"
                  label="ZIP/Postal Code"
                  mb={rem(25)}
                  {...getInputProps("zip_pc")}
                />
                <LeafletLocationPickerMap
                  center={
                    selectedLocation
                      ? {
                          lng: selectedLocation?.geometry?.coordinates[0] as number,
                          lat: selectedLocation?.geometry?.coordinates[1] as number,
                        }
                      : {
                          lat: 43.70404030217445,
                          lng: -79.43319475268419,
                        }
                  }
                  wrapperProps={{
                    mx: "auto",
                    h: 240,
                    sx: {
                      zIndex: 0,
                    },
                  }}
                  onClick={handleMapClick}
                  loading={locationsIsFetching || reverseLocationIsFetching}
                />
                {values?.country && (
                  <Text mt={rem(25)} size={rem(14)}>
                    <b>Country</b>: {values.country}
                  </Text>
                )}
                {values?.country && (
                  <Text mt={rem(5)} size={rem(14)}>
                    <b>Province/State</b>: {values.province_state}
                  </Text>
                )}
                {values?.country && (
                  <Text mt={rem(5)} size={rem(14)}>
                    <b>City</b>: {values.city}
                  </Text>
                )}
                <Divider
                  mt={rem(46)}
                  mb={rem(25)}
                  label="Privacy"
                  labelProps={{ size: "14px", color: "#FFF" }}
                />
                <Switch
                  {...getInputProps("is_private")}
                  checked={values.is_private}
                  color="teal"
                  size="sm"
                  label="Make this event private"
                  styles={{
                    label: {
                      fontSize: rem(11),
                      cursor: "pointer",
                    },
                    track: {
                      cursor: "pointer",
                    },
                  }}
                  thumbIcon={
                    values.is_private ? (
                      <IconCheck
                        size="0.8rem"
                        color={theme.colors.teal[theme.fn.primaryShade()]}
                        stroke={3}
                      />
                    ) : (
                      <IconX
                        size="0.8rem"
                        color={theme.colors.red[theme.fn.primaryShade()]}
                        stroke={3}
                      />
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} xs={12}>
                <Divider
                  mb={rem(38)}
                  label="Date and Time"
                  labelProps={{ size: "14px", color: "#FFF" }}
                />

                <DatePickerInput
                  label="Start Date and End Date"
                  placeholder="Select Date"
                  withAsterisk
                  value={[values?.start_at, values?.end_at]}
                  onChange={(e) => {
                    setFieldValue("start_at", e[0]);
                    setFieldValue("end_at", e[1]);
                  }}
                  styles={{
                    input: {
                      height: 40,
                    },
                  }}
                  allowSingleDateInRange
                  minDate={new Date()}
                  type="range"
                  mx="auto"
                  mb={rem(25)}
                  numberOfColumns={2}
                  error={errors.start_at ? errors.start_at : errors.end_at ? errors.end_at : null}
                />

                <Grid gutter={rem(isMobile ? 25 : 12)} mb={rem(25)}>
                  <Grid.Col span={12} md={6}>
                    <TimeInput
                      label="Start Time"
                      withAsterisk
                      {...getInputProps("start_time")}
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
                      {...getInputProps("end_time")}
                      styles={{
                        input: {
                          height: 40,
                        },
                      }}
                    />
                  </Grid.Col>
                </Grid>

                <Select
                  label="Timezone"
                  placeholder="Pick the event's timezone"
                  data={timezonesIsSuccess ? timezonesData?.map((tz) => tz.name) : []}
                  searchable
                  nothingFound="No results"
                  mb={rem(30)}
                  disabled={!isCreate && status !== "draft"}
                  {...getInputProps("time_zone")}
                />

                <Divider
                  mb={rem(42)}
                  label="Contact Details"
                  labelProps={{ size: "14px", color: "#FFF" }}
                />

                <TextInput
                  placeholder="Your email"
                  label="Email Address"
                  mb={rem(25)}
                  {...getInputProps("contact_email")}
                />

                <PhoneNumberInput
                  label="Phone Number"
                  placeholder="(506) 234-5678"
                  withAsterisk={false}
                  inputProps={{ ...getInputProps("contact_phone") }}
                  setCountryCode={(e) => setFieldValue("country_code", e)}
                  initialActiveCode={values.country_code || ""}
                />
                {isSummary && (
                  <>
                    <Textarea
                      label="Message to Attendees"
                      placeholder="Due to unforeseen circumstances, the Organizer rescheduled/canceled. For queries, contact the event organizer."
                      withAsterisk
                      minRows={5}
                      styles={{
                        input: {
                          resize: "vertical",
                          paddingBottom: isTablet
                            ? `${rem(13)} !important`
                            : `${rem(25)} !important`,
                        },
                      }}
                      mt={rem(38)}
                      {...getInputProps("message_to_attendee")}
                    />
                    <Text mt={2} size={rem(10)} lh={rem(14)} color="rgba(255, 255, 255, 0.50)">
                      {values?.message_to_attendee?.length || 0}/240. This message will be sent by
                      email and text message, to all of your event’s attendees.
                    </Text>
                    <Text color="#E03130" mt={rem(11)}>
                      Attendees will be able to request refunds to any rescheduled event. This
                      cannot be undone.
                    </Text>
                  </>
                )}

                {isTablet && (
                  <Box mt={rem(34)}>
                    <EventImageUploader
                      file={values.primary_image}
                      onChange={(file) => setFieldValue("primary_image", file)}
                      error={errors?.primary_image}
                    />
                    {!isSummary && (
                      <Text size={rem(10)} fw={"300"} lh={rem(17)} color="rgba(255, 255, 255, 0.6)">
                        1. Supported File Formats (PNG, JPEG) <br />
                        2. Recommended Ratio (1500 x 500px) <br />
                        3. File Size Limits: 3 MB or less. <br />
                      </Text>
                    )}
                  </Box>
                )}
              </Grid.Col>
              {isTablet && (
                <Group
                  spacing={rem(10)}
                  pos={isTablet ? "fixed" : undefined}
                  px={32}
                  {...(isTablet ? mobileActionProps : {})}
                >
                  <Actions />
                </Group>
              )}
            </Grid>
          </Container>
        </form>

        <Modal
          centered={true}
          withCloseButton={false}
          opened={opened}
          onClose={close}
          styles={(theme) => ({
            content: {
              background: theme.colors.nvtPrimary[4],
              padding: isTablet ? "40px 13px" : "40px 50px",
            },
            body: {
              padding: 0,
            },
          })}
        >
          <Title
            order={4}
            size={rem(isTablet ? 20 : 24)}
            fw={500}
            c="rgba(255, 255, 255, 0.80)"
            align="center"
          >
            Cancel the Event
          </Title>
          <Text mt={rem(27)} color="rgba(255, 255, 255, 0.70)" fw={500} size={rem(14)}>
            Are you sure you want to Cancel the Event? <br />
            <br /> This cannot be undone.
          </Text>
          <Group position="center" mt={rem(35)}>
            <Button
              size="md"
              px={rem(18)}
              py={rem(8.5)}
              variant="outline"
              h={rem(44)}
              fz={rem(15)}
              fw={600}
              onClick={() => close()}
            >
              Discard
            </Button>
            <Button
              size="md"
              px={rem(18)}
              py={rem(8.5)}
              color="red"
              bg="#E03130"
              h={rem(44)}
              fz={rem(15)}
              fw={400}
              onClick={() => handleCancelEvent()}
            >
              Cancel Event
            </Button>
          </Group>
        </Modal>

        <Modal
          opened={deleteOpened}
          onClose={closeDelete}
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
            size={rem(isTablet ? 20 : 24)}
            fw={600}
            c="rgba(255, 255, 255, 0.80)"
            mt={rem(isTablet ? 26 : 32)}
            mb={rem(isTablet ? 19 : 27)}
            align="center"
          >
            Delete Event
          </Title>
          <Text
            c="rgba(255, 255, 255, 0.70)"
            align="center"
            fz={rem(isTablet ? 14 : 16)}
            fw={300}
            lts="-0.28px"
          >
            Are you sure you want to delete {values?.name}?
          </Text>
          <Stack align="center" mt={rem(isTablet ? 25 : 33)} mb={rem(42)} spacing={rem(12)}>
            <Button
              color="red"
              bg="#E03130"
              fullWidth
              maw={rem(266)}
              h={rem(44)}
              fz={rem(15)}
              fw={400}
              onClick={() => handleDeleteEvent()}
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
              onClick={closeDelete}
            >
              Cancel
            </Button>
          </Stack>
        </Modal>
      </OrganizerDashboardLayout>
      <StripeSetupModal opened={stripeSetupOpened} />
    </NoSsr>
  );
};
