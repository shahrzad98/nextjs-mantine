import {
  getAttendeeAccount,
  getLocationsList,
  getReverseLocation,
  requestVerificationEmail,
  updateAttendeeAccount,
} from "@/api/handler";
import { getAttendeeStripeDashboard } from "@/api/handler/attendee";
import { useBreakpoint } from "@/hooks";
import { SettingsSection } from "@/modules";
import userStore from "@/stores/userStore";
import { isHttpError } from "@/types";
import { IAttendeeAccountRequest } from "@/types/user";
import {
  emailRegex,
  errorNotification,
  generateISODateTime,
  getChangedFormValues,
  locationIsAccurate,
  subtractYears,
  successNotification,
} from "@/utils";
import {
  attendeeMyAccountKey,
  attendeeStripeDashboardKey,
  locationKey,
  reverseLocationKey,
} from "@/utils/queryKeys";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";

import { ILocationAutocompleteItem, LocationAutocomplete } from "@/components";

dayjs.extend(utc);

const LeafletLocationPickerMap = dynamic(() => import("@/components/LeafletLocationPickerMap"), {
  ssr: false,
});

export const AttendeeSettings = () => {
  const router = useRouter();

  const { isTablet } = useBreakpoint();
  const currentUser = userStore((state) => state.currentUser);
  const setUser = userStore((state) => state.setUser);

  const [emailAddress, setEmailAddress] = useState<string>("");
  const [editingEmail, setEditingEmail] = useState<boolean>(false);
  const [resendEmailCounter, setResendEmailCounter] = useState<number>(0);
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
  const [addressError, setAddressError] = useState<string>("");
  interface IFormValues {
    [key: string]: any;
  }
  const {
    getInputProps,
    onSubmit,
    isDirty,
    isValid,
    setValues,
    setFieldValue,
    values,
    resetDirty,
  } = useForm<IFormValues>({
    initialValues: {
      first_name: "",
      last_name: "",
      country: "",
      city: "",
      province_state: "",
      date_of_birth: "",
      address: "",
      zip_pc: "",
      lat: 0,
      lng: 0,
    },

    validate: {
      first_name: (value) =>
        value.replace(/\s/g, "").length < 2
          ? "First name must have at least 2 letters"
          : !/^[^#%@&*:<>?/{|}]+$/.test(value)
          ? "First name should not contain any special characters!"
          : null,
      last_name: (value) =>
        value.replace(/\s/g, "").length < 2
          ? "Last name must have at least 2 letters"
          : !/^[^#%@&*:<>?/{|}]+$/.test(value)
          ? "Last name should not contain any special characters!"
          : null,
    },

    transformValues: (values) => {
      const date = generateISODateTime(values.date_of_birth as string, "00:00");

      return {
        ...values,
        date_of_birth: date,
      };
    },
  });
  const queryClient = useQueryClient();

  const {
    data: myAccount,
    isSuccess,
    error,
  } = useQuery([attendeeMyAccountKey], () => getAttendeeAccount().then((res) => res.data), {
    initialData: queryClient.getQueryData([attendeeMyAccountKey]),
  });

  useEffect(() => {
    if (!currentUser) return;
    if (isSuccess) {
      setUser({
        token: currentUser?.token,
        expiry: currentUser?.expiry as number,
        refreshToken: currentUser?.refreshToken,
        apiTokenExpiry: currentUser?.apiTokenExpiry,
        role: currentUser?.role,
        data: { ...currentUser?.data, ...myAccount },
      });

      const { email, lat, lng, address, city, province_state, country, date_of_birth } = myAccount;

      setEmailAddress(email);
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

      const accountDataFormValues = {
        ...Object.fromEntries(
          Object.entries(myAccount)
            .map(([k, v]) => [k, v ?? ""])
            .filter(
              ([k]) =>
                ![
                  "current_access_token",
                  "email",
                  "email_confirmed_at",
                  "mobile_confirmed_at",
                  "id",
                ].includes(k)
            )
        ),
        date_of_birth: date_of_birth ? dayjs(date_of_birth).toDate() : null,
      };
      setValues(accountDataFormValues);
      resetDirty(accountDataFormValues);
    }
  }, [myAccount, isSuccess]);

  useEffect(() => {
    isHttpError(error) && errorNotification(error);
  }, [error]);

  const {
    data: locationData,
    isSuccess: locationIsSuccess,
    isFetching: locationIsFetching,
  } = useQuery(
    [locationKey, debouncedSearchValue],
    () => getLocationsList(debouncedSearchValue).then((res) => res?.data?.features),
    {
      enabled: debouncedSearchValue?.trim()?.length > 2,
    }
  );

  const handleSearch = (val: string) => {
    setSearchValue(val);

    if (val.trim().length === 0) {
      setSelectedLocation(null);
      setAddressError("");
      setFieldValue("address", "");
      setFieldValue("country", "");
      setFieldValue("province_state", "");
      setFieldValue("city", "");
      setFieldValue("lng", "");
      setFieldValue("lat", "");
    } else {
      const { country, province_state, city, address, lat, lng } = values;

      if (!!country && !!province_state && !!city && !!address && !!lat && !!lng) {
        setAddressError("");
      } else {
        setAddressError("Please select a more detailed address.");
      }
    }
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
    setAddressError("");
    setMapCenter(latlng);
  };

  useEffect(() => {
    const timer =
      resendEmailCounter > 0
        ? setInterval(() => setResendEmailCounter(resendEmailCounter - 1), 1000)
        : undefined;

    return () => clearInterval(timer);
  }, [resendEmailCounter]);

  const { mutate: resendEmail } = useMutation((email: string) => requestVerificationEmail(email), {
    onSuccess: () => {
      successNotification({
        title: "Email Confirmation Sent",
        message:
          "A confirmation link has been sent to your email. Please make sure to check your spam folder as well.",
      });
      setResendEmailCounter(120);
    },
    onError: () => {
      notifications.show({
        title: "Something went wrong contacting the server!",
        message: "Please visit another time or contact support.",
        color: "red",
      });
    },
  });

  const handleResendEmail = () => {
    if (resendEmailCounter === 0) {
      resendEmail(emailAddress);
    } else {
      notifications.show({
        message: `Please wait ${resendEmailCounter} before another request.`,
        color: "red",
      });
    }
  };

  const { mutate: updateMyAccount, isLoading: updateAccountLoading } = useMutation(
    ({ data }: { data: IAttendeeAccountRequest; type: "account" | "email" }) =>
      updateAttendeeAccount(data).then((res) => res.data),
    {
      onSuccess: (data, { type }) => {
        if (type === "email") {
          successNotification({
            title: "Your Email Has Been Updated",
            message:
              "A confirmation link has been sent to your email. Please make sure to check your spam folder as well.",
          });

          setResendEmailCounter(0);
          setEditingEmail(false);
        } else {
          successNotification({ message: "Your Account Has Been Updated." });
        }
        const accountDataFormValues = {
          ...Object.fromEntries(
            Object.entries(data)
              .map(([k, v]) => [k, v ?? ""])
              .filter(
                ([k]) =>
                  ![
                    "current_access_token",
                    "email",
                    "email_confirmed_at",
                    "mobile_confirmed_at",
                    "id",
                  ].includes(k)
              )
          ),
          date_of_birth: dayjs(data.date_of_birth).toDate(),
        };

        resetDirty(accountDataFormValues);

        queryClient.setQueryData([attendeeMyAccountKey], data);

        if (!currentUser) return;
        setUser({
          token: currentUser?.token,
          refreshToken: currentUser?.refreshToken,
          apiTokenExpiry: currentUser?.apiTokenExpiry,
          expiry: currentUser?.expiry as number,
          role: currentUser?.role,
          data: { ...currentUser?.data, ...data },
        });
      },
      onError: (error) => {
        isHttpError(error) && errorNotification(error);
      },
    }
  );

  const handleUpdateEmail = () => {
    if (emailRegex.test(emailAddress)) {
      updateMyAccount({
        data: { email: emailAddress },
        type: "email",
      });
    } else {
      notifications.show({
        title: "Error!",
        color: "red",
        message: "Please provide a valid email address.",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  const {
    data: stripeDashboardData,
    isSuccess: stripeDashboardIsSuccess,
    error: stripeDashboardError,
  } = useQuery(
    [attendeeStripeDashboardKey],
    () => getAttendeeStripeDashboard().then((res) => res.data),
    {
      initialData: queryClient.getQueryData([attendeeMyAccountKey]),
      enabled: false,
    }
  );

  useEffect(() => {
    if (stripeDashboardIsSuccess) {
      window.open(stripeDashboardData.url, "_blank");
    }
  }, [stripeDashboardData?.url, stripeDashboardIsSuccess]);

  useEffect(() => {
    if (isHttpError(stripeDashboardError)) {
      errorNotification(stripeDashboardError as AxiosError);
    }
  }, [stripeDashboardError]);

  return (
    <form
      onSubmit={onSubmit((data) =>
        updateMyAccount({ data: getChangedFormValues(data, isDirty), type: "account" })
      )}
    >
      {!isTablet && (
        <Container maw={rem(1240)} p={0} pr={rem(16)}>
          <Flex justify="space-between" align="center" py={rem(24)}>
            <Group spacing={0}>
              <ActionIcon
                size="xl"
                variant="transparent"
                w="auto"
                px={rem(20)}
                onClick={handleBack}
              >
                <IconArrowLeft size={rem(24)} color="rgba(255, 255, 255, 0.80)" />
              </ActionIcon>
              <Title order={3} size={rem(24)} c="rgba(255, 255, 255, 0.80)" fw={500}>
                My Account
              </Title>
            </Group>
            <Button
              size="md"
              variant="gradient"
              gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
              fz={rem(15)}
              py={rem(8.5)}
              px={rem(18)}
              sx={{ fontWeight: 400 }}
              type="submit"
              disabled={!isValid() || !isDirty()}
              loading={updateAccountLoading}
            >
              Save
            </Button>
          </Flex>
        </Container>
      )}
      <Container
        maw={rem(1038)}
        my={rem(24)}
        pt={rem(isTablet ? 50 : 20)}
        px={rem(isTablet ? 27 : 16)}
      >
        <Grid gutter={rem(20)} gutterLg={rem(60)} grow>
          <Grid.Col span={12} md={4}>
            <SettingsSection title="Contact Details">
              {myAccount?.email_confirmed_at ? (
                <TextInput
                  sx={{
                    input: { background: "#282B3D", color: "rgba(255, 255, 255, 0.70)" },
                    label: { color: "rgba(255, 255, 255, 0.70)" },
                  }}
                  label="Email"
                  icon={<IconCheck size={rem(18)} color="#43C559" />}
                  variant="filled"
                  readOnly
                  value={myAccount.email}
                />
              ) : (
                <>
                  {editingEmail ? (
                    <Stack spacing={rem(2)} align="flex-start">
                      <TextInput
                        sx={{
                          input: { color: "rgba(255, 255, 255, 0.70)" },
                          label: { color: "rgba(255, 255, 255, 0.70)" },
                        }}
                        w="100%"
                        label="Email"
                        placeholder="Your email"
                        value={emailAddress}
                        onChange={(event) => setEmailAddress(event.currentTarget.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleUpdateEmail();
                          }
                        }}
                      />

                      <Anchor
                        component="button"
                        type="button"
                        c="blue"
                        size="xs"
                        onClick={handleUpdateEmail}
                      >
                        Update Email Address
                      </Anchor>
                    </Stack>
                  ) : (
                    <Stack spacing={rem(2)} align="flex-start">
                      <TextInput
                        sx={{
                          input: { background: "#282B3D", color: "rgba(255, 255, 255, 0.70)" },
                          label: { color: "rgba(255, 255, 255, 0.70)" },
                        }}
                        w="100%"
                        label="Email"
                        placeholder="Your email"
                        value={emailAddress}
                        variant="filled"
                        readOnly
                      />
                      <Flex w="100%" justify="space-between">
                        <Anchor
                          component="button"
                          type="button"
                          c="red"
                          size="xs"
                          onClick={handleResendEmail}
                        >
                          {resendEmailCounter === 0
                            ? "Resend Confirmation Link"
                            : `${resendEmailCounter} seconds until another try`}
                        </Anchor>
                        <Anchor
                          component="button"
                          type="button"
                          c="blue"
                          size="xs"
                          onClick={() => setEditingEmail(true)}
                        >
                          Change Email Address
                        </Anchor>
                      </Flex>
                    </Stack>
                  )}
                </>
              )}
              {/* <TextInput
                sx={{
                  input: { background: "#282B3D", color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                label="Phone Number"
                readOnly
                icon={<IconCheck size={rem(18)} color="#43C559" />}
                variant="filled"
                {...getInputProps("mobile")}
              /> */}
            </SettingsSection>
            {/*{!!myAccount?.email_confirmed_at && (*/}
            {/*  <SettingsSection title="Payment Settings & Billing History" mt={rem(20)}>*/}
            {/*    <Button*/}
            {/*      variant="outline"*/}
            {/*      c="#6273E8"*/}
            {/*      sx={{ borderColor: "#6273E8" }}*/}
            {/*      size="md"*/}
            {/*      leftIcon={<Image src={IconStripe} alt="Stripe logo" />}*/}
            {/*      onClick={() => handleVisitStripeDashboard()}*/}
            {/*      h={rem(44)}*/}
            {/*    >*/}
            {/*      Payment Settings*/}
            {/*    </Button>*/}
            {/*  </SettingsSection>*/}
            {/*)}*/}
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <SettingsSection title="Personal Information">
              <TextInput
                sx={{
                  input: { color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                label="First Name"
                withAsterisk
                required
                placeholder="John"
                {...getInputProps("first_name")}
              />
              <TextInput
                sx={{
                  input: { color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                label="Last Name"
                withAsterisk
                required
                placeholder="Doe"
                {...getInputProps("last_name")}
              />
              <Select
                label="Gender"
                sx={{
                  input: { color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                placeholder="Select"
                data={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                  { value: "prefer_not_to_say", label: "Prefer not to say" },
                ]}
                {...getInputProps("gender")}
              />
              <DatePickerInput
                label="Date of Birth"
                sx={{
                  button: { color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                placeholder="Pick date"
                maxDate={subtractYears(new Date(), 18)}
                {...getInputProps("date_of_birth")}
              />
            </SettingsSection>
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <Divider
              mb={rem(isTablet ? 20 : 31)}
              label="Location"
              labelProps={{ size: "14px", color: "rgba(255, 255, 255, 0.70)" }}
            />
            <LocationAutocomplete
              {...getInputProps("address")}
              mb={rem(25)}
              data={
                locationIsSuccess
                  ? locationData.map((location) => ({
                      ...location,
                      value: location?.properties?.label ?? "",
                    }))
                  : []
              }
              isFetching={locationIsFetching}
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
                !locationIsFetching && locationIsSuccess ? <Text>No results found</Text> : null
              }
              withAsterisk={false}
              error={addressError}
            />
            <TextInput
              sx={{
                input: { color: "rgba(255, 255, 255, 0.70)" },
                label: { color: "rgba(255, 255, 255, 0.70)" },
              }}
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
                w: "100%",
                sx: {
                  zIndex: 0,
                },
              }}
              onClick={handleMapClick}
              loading={locationIsFetching || reverseLocationIsFetching}
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
          </Grid.Col>
        </Grid>
      </Container>
      {isTablet && (
        <Box bg="dark" pos="sticky" sx={{ bottom: 0 }}>
          <Container py={rem(16)}>
            <Button
              size="md"
              variant="gradient"
              gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
              fz={rem(15)}
              sx={{ fontWeight: 400 }}
              fullWidth
              type="submit"
              disabled={!isValid() || !isDirty()}
              loading={updateAccountLoading}
            >
              Save
            </Button>
          </Container>
        </Box>
      )}
    </form>
  );
};
