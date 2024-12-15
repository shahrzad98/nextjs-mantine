import { getLocationsList, getReverseLocation } from "@/api/handler/location";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { CustomErrorResponse, isHttpError } from "@/types/http";
import { errorNotification, locationKey } from "@/utils";
import {
  ActionIcon,
  Autocomplete,
  Box,
  Divider,
  Flex,
  Group,
  Loader,
  rem,
  Text,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconChevronDown, IconCurrentLocation, IconMapPin, IconX } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ComponentPropsWithoutRef, forwardRef, useEffect, useRef, useState } from "react";

import { ILocationAutocompleteItem } from "@/components";

interface IDateSelectItemProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
}

interface IDropdownProps extends ComponentPropsWithoutRef<"div"> {
  onCurrentLocation: () => void;
  isFetching: boolean;
  isCurrentLocation: boolean;
  autocompleteInputValue: string;
}

interface IEventLocationInputProps {
  location: Partial<ILocationAutocompleteItem> | null;
  setLocation: (value: Partial<ILocationAutocompleteItem> | null) => void;
  transparentInput?: boolean;
}

const SelectItem = forwardRef<HTMLDivElement, IDateSelectItemProps>(
  ({ label, ...others }: IDateSelectItemProps, ref) => (
    <>
      <Group
        position="left"
        ref={ref}
        {...others}
        sx={{
          height: 36,
          padding: "0 0.75rem",
        }}
        spacing={"0.5rem"}
      >
        <Text size="sm">{label}</Text>
      </Group>
    </>
  )
);

SelectItem.displayName = "SelectItem";

const LocationDropdown = forwardRef<HTMLDivElement, IDropdownProps>(
  (
    {
      children,
      onCurrentLocation,
      isFetching,
      isCurrentLocation,
      autocompleteInputValue,
      ...props
    }: IDropdownProps,
    ref
  ) => (
    <Group ref={ref} {...props} sx={{ gap: 0, width: "100%" }}>
      <Flex
        h={36}
        w="100%"
        align="center"
        px="sm"
        py={0}
        m="0.25rem"
        sx={(theme) => ({
          borderRadius: theme.radius.sm,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: theme.colors.dark[4],
          },
        })}
        gap="0.5rem"
        onClick={() => onCurrentLocation()}
      >
        <IconCurrentLocation color={isCurrentLocation ? "#3077F3" : undefined} size={"1.25rem"} />
        <Text size="sm" color={isCurrentLocation ? "#3077F3" : undefined}>
          Current Location
        </Text>
      </Flex>

      {!isCurrentLocation && autocompleteInputValue.length > 2 && (
        <Divider my="sm" m={"0 !important"} w={"100%"} color="#373A3F" />
      )}
      {!isCurrentLocation && !isFetching && autocompleteInputValue.length > 2 && children}
      {!isCurrentLocation && isFetching && (
        <Flex w={"100%"} align={"center"} justify={"center"}>
          <Loader size={"1.5rem"} my={rem(16)} />
        </Flex>
      )}
    </Group>
  )
);

LocationDropdown.displayName = "LocationDropdown";

export const EventLocationInput = ({
  location,
  setLocation,
  transparentInput = false,
}: IEventLocationInputProps) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const currentUser = userStore((store) => store.currentUser);

  const { mutate: getCurrentLocation } = useMutation(
    ({ lat, lng }: { lat: number; lng: number }) => getReverseLocation(lat, lng),
    {
      onSuccess: (res) => {
        const currentLocation = res?.data?.features.find(
          (item) => item.geometry.type === "Point"
        ) as ILocationAutocompleteItem;
        setLocation(currentLocation);
        setIsCurrentLocation(true);
      },
      onError: (error: AxiosError<CustomErrorResponse>) => {
        errorNotification(error);
      },
    }
  );

  const [debouncedSearchValue] = useDebouncedValue(inputValue, 200);
  const { data: locationsData, isFetching } = useQuery(
    [locationKey, debouncedSearchValue],
    () => getLocationsList(debouncedSearchValue).then((res) => res?.data?.features),
    {
      enabled: debouncedSearchValue?.trim()?.length > 2,
    }
  );

  const onCurrentLocation = () => {
    if (currentUser?.data?.lat && currentUser?.data?.lng && currentUser?.data?.address) {
      const address = `${currentUser?.data?.address}, ${currentUser?.data?.city}, ${currentUser?.data?.province_state}, ${currentUser?.data?.country}`;

      setLocation({
        properties: {
          label: address,
          id: "",
          accuracy: "point",
        },
        geometry: { coordinates: [currentUser?.data?.lat, currentUser?.data?.lng] },
      });
      setIsCurrentLocation(true);
    } else {
      const successCallback = (position: GeolocationPosition) => {
        getCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      };

      const errorCallback = (error: GeolocationPositionError) => {
        isHttpError(error) && errorNotification(error);
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
  };

  const handleIconClick = () => {
    ref?.current?.focus();
  };

  const handleClearLocation = () => {
    setLocation(null);
    setIsCurrentLocation(false);
  };

  useEffect(() => {
    setInputValue(location?.properties?.label ?? "");
  }, [location]);

  return (
    <Box w={isMobile ? "100%" : isTablet ? 500 : 306}>
      <Autocomplete
        placeholder="Choose a location"
        itemComponent={(props) => <SelectItem {...props} />}
        ref={ref}
        dropdownComponent={(props: IDropdownProps) => (
          <LocationDropdown
            {...props}
            onCurrentLocation={onCurrentLocation}
            isFetching={isFetching}
            isCurrentLocation={isCurrentLocation}
            autocompleteInputValue={inputValue}
          />
        )}
        onItemSubmit={(value) => {
          setLocation(value as ILocationAutocompleteItem);
          setIsCurrentLocation(false);
        }}
        data={
          locationsData?.map((location) => ({
            ...location,
            value: location?.properties?.label ?? "",
            label: location?.properties?.label ?? "",
          })) ?? []
        }
        icon={
          <IconMapPin
            size={isMobile ? rem(16) : rem(26)}
            style={{ left: 6, position: "relative" }}
          />
        }
        rightSection={
          inputValue ? (
            <ActionIcon variant="transparent" onClick={handleClearLocation}>
              <IconX color="rgba(255, 255, 255, 0.8)" size={isMobile ? rem(16) : rem(24)} />
            </ActionIcon>
          ) : !isTablet ? (
            <IconChevronDown size={22} stroke={2} onClick={handleIconClick} cursor="pointer" />
          ) : null
        }
        rightSectionWidth="2.75rem"
        sx={(theme) => ({
          input: {
            height: isMobile ? 40 : 59,
            paddingLeft: "44px!important",
            fontSize: isMobile ? rem(14) : rem(16),
            background: transparentInput ? theme.colors.nvtPrimary[4] : "",
            borderColor: transparentInput ? theme.colors.nvtPrimary[6] : "",
            textOverflow: "ellipsis",
          },
          "& .mantine-Autocomplete-dropdown": {
            background: transparentInput ? theme.colors.nvtPrimary[4] : "",
            borderColor: transparentInput ? theme.colors.nvtPrimary[6] : "",
          },
        })}
        nothingFound={"No results found"}
        transitionProps={{ transition: "pop-top-left", duration: 80, timingFunction: "ease" }}
        value={inputValue}
        onChange={(value) => {
          setInputValue(value as string);
          setIsCurrentLocation(false);
        }}
        limit={3}
      />
    </Box>
  );
};
