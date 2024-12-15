import { updateOrganizerSettings } from "@/api/handler/auth";
import { getLocationsList, getReverseLocation } from "@/api/handler/location";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { CustomErrorResponse, isHttpError } from "@/types/http";
import { IOrganizatonSettings, IUserStore } from "@/types/user";
import { locationIsAccurate } from "@/utils";
import { errorNotification } from "@/utils";
import { locationKey, reverseLocationKey } from "@/utils/queryKeys";
import {
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Text,
  TextInput,
  Textarea,
  Title,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Fragment, KeyboardEvent, useCallback, useEffect, useState } from "react";

import {
  ILocationAutocompleteItem,
  LocationAutocomplete,
  NovelTHead,
  NVTLayout,
} from "@/components";

import { OrganizationImageUploader } from "./OrganizationImageUploader";

const LeafletLocationPickerMap = dynamic(() => import("@/components/LeafletLocationPickerMap"), {
  ssr: false,
});

interface IFormValues {
  cover_photo: File | string | null;
  [key: string]: any;
}

export const OnboardingAccountSetupModule = () => {
  const { isMobile } = useBreakpoint();
  const router = useRouter();

  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const token = currentUser?.token;

  !token && router.isReady && router.push("/organization/auth/login");

  const { onSubmit, getInputProps, setFieldValue, values, isDirty } = useForm<IFormValues>({
    initialValues: {
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
    validate: {},
  });

  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 200);
  const [selectedLocation, setSelectedLocation] = useState<ILocationAutocompleteItem | null>(null);
  const [mapCenter, setMapCenter] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });
  const [addressError, setAddressError] = useState<string>("");

  const { data, isSuccess, isFetching } = useQuery(
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
      onSuccess: () => router.push("/organization"),
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
      formData.append(key, value as string | Blob);
    });

    handleAccountSetup(formData as Partial<IOrganizatonSettings>);
  };

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <NVTLayout backgroundGradientVariant={12}>
      <NovelTHead title="Account Setup" />
      <Container size={!isMobile ? rem(1042) : "xs"} mih={"75vh"} mb={rem(80)} px={rem(27)}>
        <form
          onSubmit={onSubmit((values) => handleSubmit(values))}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <Flex
            justify={"space-between"}
            align={"center"}
            mt={20}
            mb={isMobile ? rem(72) : rem(50)}
          >
            <Title size={isMobile ? rem(18) : rem(24)} fw={"500"} color="rgba(255, 255, 255, 0.8)">
              Organization Info
            </Title>
            {!isMobile && (
              <Group spacing={20}>
                <Button
                  size="md"
                  variant="outline"
                  fw={"400"}
                  onClick={() => router.push("/organization")}
                >
                  Skip for now
                </Button>
                <Button
                  size="md"
                  variant="gradient"
                  gradient={{ from: "#3077F3", to: "#15AABF" }}
                  fw={"400"}
                  type="submit"
                  sx={{
                    fontSize: 15,
                    "&:disabled": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
                  }}
                  loading={accountSetupLoading}
                  disabled={!isDirty()}
                >
                  Continue
                </Button>
              </Group>
            )}
          </Flex>

          <Grid gutter={isMobile ? 32 : 70}>
            <Grid.Col md={4} lg={4} xs={12}>
              <Textarea
                autosize
                minRows={4}
                placeholder="Description"
                label="Organization Description"
                labelProps={{
                  mb: 10,
                }}
                {...getInputProps("description")}
              />
            </Grid.Col>
            <Grid.Col md={4} lg={4} xs={12}>
              <Divider mb={rem(31)} label="Organization Address" labelProps={{ size: "14px" }} />

              <LocationAutocomplete
                mb={rem(25)}
                data={
                  isSuccess
                    ? data.map((location) => ({
                        ...location,
                        value: location?.properties?.label ?? "",
                      }))
                    : []
                }
                isFetching={isFetching}
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
                nothingFound={!isFetching && isSuccess ? <Text>No results found</Text> : null}
                withAsterisk={false}
                error={addressError}
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
                        lng: selectedLocation?.geometry?.coordinates[0],
                        lat: selectedLocation?.geometry?.coordinates[1],
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
                loading={isFetching || reverseLocationIsFetching}
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
            <Grid.Col md={4} lg={4} xs={12}>
              <Divider mb={rem(31)} label="Cover Photo" labelProps={{ size: "14px" }} />
              <Text c="#FFFFFF" fw={400}>
                Organization Cover Photo
              </Text>

              <OrganizationImageUploader
                file={values.cover_photo}
                onChange={(file) => setFieldValue("cover_photo", file)}
              />
              <Text size={rem(10)} fw={"300"} lh={rem(17)} color="rgba(255, 255, 255, 0.6)">
                1. Supported File Formats (PNG, JPEG) <br />
                2. Recommended Ratio (1500 x 500px) <br />
                3. File Size Limits: 3 MB or less. <br />
              </Text>
            </Grid.Col>
          </Grid>

          {isMobile && (
            <Group spacing={20} mt={isMobile ? rem(30) : undefined}>
              <Button
                fullWidth
                size="md"
                variant="outline"
                fw={"400"}
                onClick={() => router.push("/organization")}
              >
                Skip for now
              </Button>
              <Button
                fullWidth
                size="md"
                variant="gradient"
                gradient={{ from: "#3077F3", to: "#15AABF" }}
                fw={"400"}
                type="submit"
                loading={accountSetupLoading}
                disabled={!isDirty()}
              >
                Continue
              </Button>
            </Group>
          )}
        </form>
      </Container>
    </NVTLayout>
  );
};
