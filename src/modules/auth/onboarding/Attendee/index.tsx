import { updateAttendeeAccount } from "@/api/handler/attendee";
import { getLocationsList, getReverseLocation } from "@/api/handler/location";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { CustomErrorResponse, isHttpError } from "@/types/http";
import { IAttendee, IUserStore } from "@/types/user";
import { locationIsAccurate, subtractYears } from "@/utils";
import { errorNotification } from "@/utils";
import { locationKey, reverseLocationKey } from "@/utils/queryKeys";
import { Button, Divider, Flex, Group, Select, Text, TextInput, rem } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconCalendar } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Fragment, KeyboardEvent, useCallback, useEffect, useState } from "react";

import {
  NVTLayout,
  LocationAutocomplete,
  ILocationAutocompleteItem,
  NovelTHead,
} from "@/components";

dayjs.extend(utc);

const LeafletLocationPickerMap = dynamic(() => import("@/components/LeafletLocationPickerMap"), {
  ssr: false,
});

export const OnboardingAttendeeModule = () => {
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const setUser = userStore((state) => state.setUser);
  const token = currentUser?.token;

  !token && router.isReady && router.push("/auth/login");

  const { values, onSubmit, getInputProps, setFieldValue, validate, isValid } = useForm({
    initialValues: {
      gender: "",
      date_of_birth: undefined,
      country: "",
      province_state: "",
      city: "",
      address: "",
      zip_pc: "",
      lat: 0,
      lng: 0,
    },

    validate: {
      date_of_birth: (value) => (value ? null : "Date of birth is required!"),
    },
    transformValues: (values) => {
      const dateOfBirth =
        values.date_of_birth &&
        dayjs.utc(new Date(values.date_of_birth)?.toISOString().split("T")[0]).toISOString();

      return {
        ...values,
        date_of_birth: dateOfBirth,
      };
    },
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

    const { country, province_state, city, address, lat, lng } = values;

    if (!!country && !!province_state && !!city && !!address && !!lat && !!lng) {
      setAddressError("");
    } else {
      setAddressError("Please select a more detailed address.");
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
    (values: Partial<IAttendee>) =>
      updateAttendeeAccount({
        ...values,
        country: values?.country !== "" ? values.country : undefined,
        province_state: values?.province_state !== "" ? values.province_state : undefined,
        city: values?.city !== "" ? values.city : undefined,
        address: values?.address !== "" ? values.address : undefined,
        zip_pc: values?.zip_pc !== "" ? values.zip_pc : undefined,
        lat: values?.lat !== 0 ? values.lat : undefined,
        lng: values?.lng !== 0 ? values.lng : undefined,
      }),
    {
      onSuccess: (res) => {
        if (currentUser)
          setUser({
            token: currentUser?.token,
            expiry: currentUser?.expiry as number,
            refreshToken: currentUser?.refreshToken,
            apiTokenExpiry: currentUser?.apiTokenExpiry,
            role: currentUser.role,
            data: { ...currentUser?.data, ...res.data },
          });
        router.push("/");
      },
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

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validate();
      if (isValid()) {
        handleAccountSetup(values);
      }
    }
  };

  return (
    <NVTLayout backgroundGradientVariant={3} navbarProps={{ emailConfirmationBanner: "myAccount" }}>
      <NovelTHead title="Account Setup" />
      <form
        onSubmit={onSubmit((values) => handleAccountSetup(values))}
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <Flex
          direction={"column"}
          w={isMobile ? "100%" : rem(306)}
          mx={"auto"}
          my={isMobile ? rem(22) : rem(64)}
          px={isMobile ? rem(27) : undefined}
        >
          <Select
            label="Gender"
            placeholder="Select Your Gender"
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
              { value: "prefer_not_to_say", label: "Prefer not to say" },
            ]}
            mb={rem(25)}
            {...getInputProps("gender")}
          />
          <DatePickerInput
            icon={<IconCalendar size="1.1rem" stroke={1.5} />}
            label="Date of Birth"
            maxDate={subtractYears(new Date(), 18)}
            defaultLevel="decade"
            placeholder="Select Date"
            mb={rem(25)}
            withAsterisk
            {...getInputProps("date_of_birth")}
          />
          <Divider
            mt={isMobile ? rem(25) : undefined}
            mb={rem(25)}
            label="Location"
            labelProps={{ size: "14px" }}
          />

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
                <Text sx={{ cursor: "pointer" }} onClick={() => handleLocationSelect(locationItem)}>
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

          <Group
            spacing={isMobile ? rem(21) : rem(36)}
            position="center"
            mb={isMobile ? rem(60) : undefined}
            mt={rem(24)}
          >
            <Button
              size="md"
              variant="gradient"
              gradient={{ from: "#3077F3", to: "#15AABF" }}
              fw={"400"}
              fullWidth={isMobile}
              type="submit"
              loading={accountSetupLoading}
            >
              Save
            </Button>
            {/* <Button
              size="md"
              variant="outline"
              fw={"400"}
              fullWidth={isMobile}
              onClick={() => router.push("/")}
            >
              Skip for now
            </Button> */}
          </Group>
        </Flex>
      </form>
    </NVTLayout>
  );
};
