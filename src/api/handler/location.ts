import { IGeoLocationsResponse } from "@/types/location";
import axios from "axios";

export const getLocationsList = (locationQuery: string, lat?: number, lon?: number) =>
  axios.get<IGeoLocationsResponse>(
    `https://api.geocode.earth/v1/autocomplete?api_key=${
      process.env.NEXT_PUBLIC_GEOCODE_EARTH_API_KEY
    }&text=${locationQuery}${
      lat && lon
        ? `&boundary.rect.min_lat=${lat - 0.18}&boundary.rect.min_lon=${
            lon - 0.18
          }&boundary.rect.max_lat=${lat + 0.18}&boundary.rect.max_lon=${lon + 0.18}`
        : ""
    }`
  );

export const getReverseLocation = (lat: number, lon: number) =>
  axios.get<IGeoLocationsResponse>(
    `https://api.geocode.earth/v1/reverse?api_key=${process.env.NEXT_PUBLIC_GEOCODE_EARTH_API_KEY}&point.lat=${lat}&point.lon=${lon}`
  );
