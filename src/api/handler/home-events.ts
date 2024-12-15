import { CustomAxiosResponse, IHomeEventsSearch, IMyEvent } from "@/types";
import { IHomeEventsRequest, IHomeEventsSearchRequest } from "@/types/home-events";

import { api } from "../apiClient";

export const searchEvents = ({
  query,
  start_date,
  end_date,
  lat,
  lng,
  page = 1,
  per_page = 12,
}: IHomeEventsSearchRequest) =>
  api.post<CustomAxiosResponse<IHomeEventsSearch>>(`/attendee/events/search`, {
    query,
    start_date,
    end_date,
    location: {
      lat,
      lng,
    },
    page,
    per_page,
  });

export const getHomeEvents = ({ per_page, page, event_type, lat, lng }: IHomeEventsRequest) =>
  api.get<CustomAxiosResponse<IMyEvent[]>>(
    `/attendee/events/${event_type}-events?per_page=${per_page}&page=${page}${
      lat ? "&lat=" + lat : ""
    }${lng ? "&lng=" + lng : ""}`
  );
