import { IGeoLocation } from "@/types/location";
import { Autocomplete, AutocompleteProps, Loader } from "@mantine/core";

export interface ILocationAutocompleteItem extends IGeoLocation {
  value: string;
}

interface ILocationAutocompleteProps extends AutocompleteProps {
  data: ILocationAutocompleteItem[];
  isFetching: boolean;
}

export const LocationAutocomplete = ({
  data,
  isFetching,
  ...props
}: ILocationAutocompleteProps) => {
  return (
    <Autocomplete
      rightSection={isFetching ? <Loader size="1rem" /> : null}
      withAsterisk
      placeholder="Your Address"
      label="Address"
      dropdownPosition="bottom"
      {...props}
      data={data}
    />
  );
};
