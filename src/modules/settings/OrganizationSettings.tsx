import { getLocationsList, getReverseLocation } from "@/api/handler";
import {
  checkOrganizationName,
  getOrganizerSettings,
  updateOrganizerSettings,
} from "@/api/handler/auth";
import { stripeAccountOnboarding, stripeDashboard } from "@/api/handler/organization";
import { useBreakpoint } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { OrganizationImageUploader, SettingsSection } from "@/modules";
import userStore from "@/stores/userStore";
import { CustomErrorResponse, ICurrentUser, IOrganizatonSettings, isHttpError } from "@/types";
import {
  errorNotification,
  getChangedFormValues,
  locationIsAccurate,
  locationKey,
  organizerMyAccountKey,
  reverseLocationKey,
  separateByThousands,
  successNotification,
} from "@/utils";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Input,
  rem,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconExternalLink } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useEffect, useState } from "react";

import { ILocationAutocompleteItem, LocationAutocomplete } from "@/components";

import IconStripe from "./assets/IconStripe.svg";

const LeafletLocationPickerMap = dynamic(() => import("@/components/LeafletLocationPickerMap"), {
  ssr: false,
});

interface IFormValues {
  cover_photo: File | string | null;

  [key: string]: any;
}

export const OrganizationSettings = () => {
  const router = useRouter();

  const { isDesktop, isTablet } = useBreakpoint();

  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [previousSlug, setPreviousSlug] = useState<string | null>(null);

  const { data: organizationNameData } = useQuery(
    ["url", organizationName],
    () => checkOrganizationName(organizationName as string),
    {
      enabled: Boolean(organizationName),
    }
  );

  const onChangeDebounced = async (name: string) => {
    setOrganizationName(name);
  };

  const onNameChangeDebounced = useDebounce(onChangeDebounced);

  const { getInputProps, setFieldValue, values, onSubmit, resetDirty, isDirty, setValues } =
    useForm<IFormValues>({
      initialValues: {
        name: "",
        description: "",
        country: "",
        city: "",
        province_state: "",
        address: "",
        zip_pc: "",
        cover_photo: null,
        lat: 0,
        lng: 0,
      },
      validate: {
        name: (values) => (values ? null : "Organization name is required"),
      },
    });

  useEffect(() => {
    if (data?.name !== values.name && data?.slug !== organizationNameData?.data) {
      onNameChangeDebounced(values.name);
      setPreviousSlug(null);
    }
    if (data?.name === values.name) {
      setPreviousSlug(data?.slug as string);
    }
  }, [values.name]);

  const queryClient = useQueryClient();

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

  const currentUser = userStore((state) => state.currentUser);
  const setUser = userStore((state) => state.setUser);
  const stripeIsActive = currentUser?.data?.organization?.active;

  const { data, isSuccess, error } = useQuery(
    [organizerMyAccountKey],
    () => getOrganizerSettings().then((res) => res.data),
    {
      initialData: queryClient.getQueryData([organizerMyAccountKey]),
    }
  );

  useEffect(() => {
    if (isSuccess) {
      const { lat, lng, address, city, province_state, country } = data;

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

      setValues(data);
      resetDirty(data);

      if (stripeIsActive !== data.active) {
        const updatedUser = {
          ...currentUser,
          data: {
            ...currentUser?.data,
            organization: {
              ...currentUser?.data?.organization,
              active: data.active,
            },
          },
        };
        setUser(updatedUser as ICurrentUser);
      }
    }
  }, [data, isSuccess, setValues]);

  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }
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
    setMapCenter(latlng);
  };

  const { mutate: handleAccountSetup, isLoading: accountSetupLoading } = useMutation(
    (values: Partial<IOrganizatonSettings>) => updateOrganizerSettings(values),
    {
      onSuccess: () =>
        successNotification({
          title: "Success",
          message: "Organization Settings Saved Successfully.",
        }),
      onError: (e: AxiosError<CustomErrorResponse>) => {
        if (e?.response?.status === 500) {
          errorNotification(e);
        } else {
          errorNotification({
            title: "Error!",
            message: e?.response?.data?.message || e?.message || "Something went wrong!",
          });
        }
      },
    }
  );

  const handleSubmit = (values: Partial<IOrganizatonSettings>) => {
    const formData = new FormData();
    Object.entries({
      ...values,
    }).forEach(([key, value]) => {
      if (!(key === "primary_image" && typeof value === "string")) {
        formData.append(key, value as string | Blob);
      }
    });

    handleAccountSetup(formData as Partial<IOrganizatonSettings>);
  };

  const { mutate: visitStripeAccountOnboarding } = useMutation(() => stripeAccountOnboarding(), {
    onSuccess: (res) => router.push(res.data.url),
    onError: (e: AxiosError<CustomErrorResponse>) => {
      if (e?.response?.status === 500) {
        errorNotification(e);
      } else {
        errorNotification({
          title: "Error!",
          message: e?.response?.data?.message || e?.message || "Something went wrong!",
        });
      }
    },
  });

  const { mutate: visitStripeDashboard, isLoading: stripeDashboardLoading } = useMutation(
    () => stripeDashboard(),
    {
      onSuccess: (res) => window.open(res.data.url, "_blank")?.focus(),
      onError: (e: AxiosError<CustomErrorResponse>) => {
        if (e?.response?.status === 500) {
          errorNotification(e);
        } else {
          errorNotification({
            title: "Error!",
            message: e?.response?.data?.message || e?.message || "Something went wrong!",
          });
        }
      },
    }
  );

  return (
    <form onSubmit={onSubmit((values) => handleSubmit(getChangedFormValues(values, isDirty)))}>
      {!isTablet && (
        <Container maw={rem(1150)}>
          <Flex justify="space-between" align="center" py={rem(24)}>
            <Title order={3} fz={rem(24)} fw={500} c="rgba(255, 255, 255, 0.80)">
              Organization Settings
            </Title>

            <Button
              size="md"
              variant="gradient"
              gradient={{ from: "#3077F3", to: "#15AABF", deg: 45 }}
              fz={rem(15)}
              py={rem(8.5)}
              px={rem(18)}
              sx={{ fontWeight: 400 }}
              type="submit"
              disabled={!isDirty()}
              loading={accountSetupLoading}
            >
              Save
            </Button>
          </Flex>
        </Container>
      )}
      <Container
        maw={rem(1066)}
        mb={rem(24)}
        pt={rem(isTablet ? 68 : 20)}
        px={rem(isTablet ? 27 : 16)}
      >
        <Grid gutter={rem(20)} gutterLg={rem(58)}>
          <Grid.Col span={12} md={4}>
            <SettingsSection title="Basic Info">
              <TextInput
                sx={{
                  input: { color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                label="Organization Name"
                placeholder="Organization Name"
                description="This field should contain only alphanumeric characters and spaces"
                descriptionProps={{
                  fz: rem(10),
                  fw: 300,
                  color: "rgba(255, 255, 255, 0.50)",
                  lts: "-0.2px",
                }}
                inputWrapperOrder={["label", "error", "input", "description"]}
                {...getInputProps("name")}
              />
              <Input.Wrapper
                label="URL"
                sx={{
                  a: {
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    background: "#282B3D",
                  },
                  svg: { color: "rgba(255, 255, 255, 0.80)" },
                }}
              >
                <Link
                  href={`${window.location.origin}/marketplace/${
                    previousSlug || organizationNameData?.data || data?.slug || ""
                  }`}
                  passHref
                  target="_blank"
                >
                  <Input
                    component="a"
                    variant="filled"
                    rightSection={<IconExternalLink size={rem(16)} />}
                    sx={{ wordBreak: "break-all" }}
                    w="100%"
                    multiline
                    display="flex"
                  >
                    <Input.Placeholder sx={{ color: "rgba(255, 255, 255, 0.40)" }} fw={400}>
                      {window.location.host}/marketplace/
                      <Text component="span" color="rgba(255, 255, 255, 0.80)" fw={400}>
                        {previousSlug || organizationNameData?.data || data?.slug || ""}
                      </Text>
                    </Input.Placeholder>
                  </Input>
                </Link>
              </Input.Wrapper>
              <Textarea
                sx={{
                  textarea: { color: "rgba(255, 255, 255, 0.70)" },
                  label: { color: "rgba(255, 255, 255, 0.70)" },
                }}
                placeholder="Your organization description will be displayed on your Organization page."
                label="Organization Description"
                {...getInputProps("description")}
              />
            </SettingsSection>
            {!isTablet && (
              <>
                <Divider
                  mt={rem(46)}
                  label="Cover Photo"
                  labelProps={{ size: "14px", color: "rgba(255, 255, 255, 0.80)" }}
                />
                <Text mt={rem(35)} c="#FFF">
                  Organization Cover Photo
                </Text>
                <OrganizationImageUploader
                  file={values.cover_photo}
                  onChange={(file) => file && setFieldValue("cover_photo", file)}
                />
                <Text size={rem(10)} fw={"300"} lh={rem(17)} color="rgba(255, 255, 255, 0.6)">
                  1. Supported File Formats (PNG, JPEG) <br />
                  2. Recommended Ratio (1500 x 500px) <br />
                  3. File Size Limits: 3 MB or less. <br />
                </Text>
              </>
            )}
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <SettingsSection title="Account Balance & Payout Settings">
              {!data?.active && (
                <Text size="sm" color="rgba(255, 255, 255, 0.80)">
                  In partnership with Stripe, novelT transfers earnings directly to your bank
                  account.
                  <br />
                  <br />
                  When your event has a sale, in order to receive your earnings, setting up your
                  Payouts will be required.
                </Text>
              )}
              {data?.active && (
                <>
                  <Text size={rem(14)}>
                    Balance{" "}
                    <Title order={3} fz={rem(20)} fw={400}>
                      {process.env.NEXT_PUBLIC_REGION === "US" ? "USD" : "CAD"} ${" "}
                      {data?.balance
                        ? separateByThousands(Number(data.balance).toFixed(2))
                        : "0.00"}
                    </Title>
                  </Text>
                </>
              )}
              <Button
                variant="outline"
                c="#6273E8"
                sx={{ borderColor: "#6273E8" }}
                size="md"
                leftIcon={<Image src={IconStripe} alt="Stripe logo" />}
                maw={isTablet ? "100%" : "max-content"}
                loading={stripeDashboardLoading}
                onClick={() =>
                  data?.active ? visitStripeDashboard() : visitStripeAccountOnboarding()
                }
                h={!isDesktop && !isTablet ? "4rem" : undefined}
              >
                {!isDesktop && !isTablet ? (
                  <>
                    {data?.active ? (
                      <>
                        See Payouts
                        <br /> & Stripe
                        <br /> Settings
                      </>
                    ) : (
                      <>
                        Set up <br />
                        Payouts <br /> via Stripe
                      </>
                    )}
                  </>
                ) : data?.active ? (
                  "See Payouts  & Stripe Settings"
                ) : (
                  "Set up Payouts via Stripe"
                )}
              </Button>
              {!data?.active && (
                <Text size={rem(11)} color="rgba(255, 255, 255, 0.80)">
                  You’ll be redirected to Stripe to complete the onboarding process.
                </Text>
              )}
            </SettingsSection>
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <Divider
              mb={rem(31)}
              label="Organization Address"
              labelProps={{ size: "14px", color: "rgba(255, 255, 255, 0.80)" }}
            />
            <LocationAutocomplete
              sx={{
                input: { color: "rgba(255, 255, 255, 0.70)" },
                label: { color: "rgba(255, 255, 255, 0.70)" },
              }}
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
            {isTablet && (
              <>
                <Divider
                  mt={rem(24)}
                  label="Cover Photo"
                  labelProps={{ size: "14px", color: "rgba(255, 255, 255, 0.80)" }}
                />
                <Text mt={rem(35)} c="#FFF">
                  Organization Cover Photo
                </Text>
                <OrganizationImageUploader
                  file={values.cover_photo}
                  onChange={(file) => file && setFieldValue("cover_photo", file)}
                />
                <Text size={rem(10)} fw={"300"} lh={rem(17)} color="rgba(255, 255, 255, 0.6)">
                  1. Supported File Formats (PNG, JPEG) <br />
                  2. Recommended Ratio (1500 x 500px) <br />
                  3. File Size Limits: 3 MB or less. <br />
                </Text>
              </>
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
              disabled={!isDirty()}
              loading={accountSetupLoading}
            >
              Save
            </Button>
          </Container>
        </Box>
      )}
    </form>
  );
};
