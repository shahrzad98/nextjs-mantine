import { ILocationAutocompleteItem } from "@/components/LocationAutocomplete";

export const locationIsAccurate = (location: ILocationAutocompleteItem) =>
  !!location?.properties?.country &&
  !!location?.properties?.region &&
  (!!location?.properties?.locality || !!location?.properties?.county) &&
  !!location?.properties?.name &&
  !!location?.properties?.street;
