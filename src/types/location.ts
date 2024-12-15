export type IGeoLocationsResponse = {
  features: IGeoLocation[];
  bbox: [number, number, number, number];
};

export interface IGeoLocation {
  geometry: {
    coordinates: [number, number];
    type?: string;
  };
  bbox: [number, number, number, number];
  properties: Partial<IGeoLocationAddress>;
}

export interface IGeoLocationAddress {
  id: string;
  country_code?: string;
  name?: string;
  housenumber?: string;
  street?: string;
  postalcode?: string;
  accuracy: "centroid" | "point";
  country?: string;
  country_a?: string;
  region?: string;
  region_a?: string;
  county?: string;
  county_a?: string;
  locality?: string;
  locality_a?: string;
  neighbourhood?: string;
  continent?: string;
  label: string;
}
