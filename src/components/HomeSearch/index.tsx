import { searchEvents } from "@/api/handler/home-events";
import NoSsr from "@/common/NoSsr";
import { useBreakpoint } from "@/hooks";
import { convertToQueryString } from "@/utils/convertToQueryString";
import { Box, Flex } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ILocationAutocompleteItem } from "@/components";

import { EventDateInput } from "./EventDateInput";
import { EventLocationInput } from "./EventLocationInput";
import { EventSearchInput } from "./EventSearchInput";

export const HomeSearch = ({
  closeModal,
  defaultQuery,
  isNavbarSearch = false,
}: {
  closeModal?: () => void;
  defaultQuery?: string;
  isNavbarSearch?: boolean;
}) => {
  const {
    query: { query, start_date, end_date, lat, lng, location },
    push,
    pathname,
  } = useRouter();

  const { isMobile, isTablet } = useBreakpoint();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const [phrase, setPhrase] = useState<string>(
    isNavbarSearch && !!defaultQuery ? (defaultQuery as string) : (query as string) || ""
  );
  const [debouncedPhrase] = useDebouncedValue(phrase, 200);

  const [selectedLocation, setSelectedLocation] =
    useState<Partial<ILocationAutocompleteItem> | null>(
      lat && lng
        ? { geometry: { coordinates: [parseFloat(lng as string), parseFloat(lat as string)] } }
        : null
    );

  const searchParams = {
    query: phrase,
    start_date: dateRange[0] ? new Date(dateRange[0])?.toISOString().split("T")[0] : undefined,
    end_date: dateRange[1] ? new Date(dateRange[1])?.toISOString().split("T")[0] : undefined,
    lat: selectedLocation?.geometry?.coordinates[1] || undefined,
    lng: selectedLocation?.geometry?.coordinates[0] || undefined,
    page: 1,
    per_page: 200,
  };

  const { data, mutate, isLoading, isSuccess } = useMutation(() =>
    searchEvents(searchParams).then((response) => response.data)
  );

  useEffect(() => {
    if (!closeModal) {
      setPhrase(query as string);
    }
  }, [query, start_date, end_date, lat, lng, location]);

  useEffect(() => {
    phrase?.length > 2 && mutate();
  }, [debouncedPhrase]);

  useEffect(() => {
    setDateRange(
      start_date && end_date
        ? [new Date(start_date as string), new Date(end_date as string)]
        : [null, null]
    );

    setSelectedLocation(
      lat && lng && location
        ? {
            geometry: { coordinates: [parseFloat(lng as string), parseFloat(lat as string)] },
            properties: { label: location as string },
          }
        : null
    );
  }, [start_date, end_date, lat, lng, location]);

  const isSearchingAllEvents =
    !pathname.includes("/organization") && !pathname.includes("/operator");

  const handleSubmit = () => {
    if (isSearchingAllEvents) {
      void push(
        `/events/search?${convertToQueryString({
          ...searchParams,
          location: selectedLocation?.properties?.label ?? "",
        })}`
      );
    } else {
      void push(`/organization/my-events?query=${phrase}`);
    }
    closeModal?.();
  };

  return (
    <NoSsr>
      {isSearchingAllEvents ? (
        <Box>
          <Flex
            gap={isTablet ? "0.325rem" : "0.75rem"}
            justify="center"
            align="center"
            direction={isTablet ? "column" : "row"}
            wrap={"wrap"}
          >
            <EventDateInput
              dateRange={dateRange}
              setDateRange={setDateRange}
              transparentInput={isNavbarSearch}
            />

            <EventLocationInput
              location={selectedLocation}
              setLocation={setSelectedLocation}
              transparentInput={isNavbarSearch}
            />
          </Flex>

          <Flex
            mt={isMobile ? "0.325rem" : "0.75rem"}
            gap="12px"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <EventSearchInput
              artists={!isLoading && isSuccess ? data.organizations : []}
              events={!isLoading && isSuccess ? data.events : []}
              isLoading={isLoading}
              phrase={phrase}
              setPhrase={setPhrase}
              closeModal={closeModal}
              onSubmit={handleSubmit}
              transparentInput={isNavbarSearch}
            />
          </Flex>
        </Box>
      ) : (
        <EventSearchInput
          artists={!isLoading && isSuccess ? data.organizations : []}
          events={!isLoading && isSuccess ? data.events : []}
          isLoading={isLoading}
          phrase={phrase}
          setPhrase={setPhrase}
          closeModal={closeModal}
          onSubmit={handleSubmit}
          variant="basic"
        />
      )}
    </NoSsr>
  );
};
