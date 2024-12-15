import { api } from "@/api/apiClient";
import { CustomAxiosResponse, IMyEvent, IPublishEventRequest } from "@/types";
import { AxiosResponse } from "axios";

export const getAttendeeEvents = (
  slug: string,
  page: number,
  perPage: number,
  lat?: number,
  lng?: number
) =>
  api.get<CustomAxiosResponse<IMyEvent[]>>(
    `/attendee/events/${slug}?page=${page}&per_page=${perPage}${lat ? "&lat=" + lat : ""}${
      lng ? "&lng=" + lng : ""
    }`
  );

export const getAttendeeEvent = (slug: string, promoter: string | null) =>
  api.get<AxiosResponse<IMyEvent>>(
    `/attendee/events/${slug}${promoter ? `?promoter=${promoter}` : ""}`
  );

export const getEvents = (slug: string, page: number, perPage: number) =>
  api.get<CustomAxiosResponse<IMyEvent[]>>(
    `/attendee/events/${slug}?per_page=${perPage}&page=${page}`
  );

export const createEvent = (eventData: FormData) =>
  api.post<CustomAxiosResponse<IMyEvent>>("/organization/events", eventData);

export const editEvent = ({ eventId, eventData }: { eventId: string; eventData: FormData }) =>
  api.put<CustomAxiosResponse<IMyEvent>>(`/organization/events/${eventId}`, eventData);

export const cancelEvent = (eventId: string) =>
  api.post<CustomAxiosResponse<IMyEvent>>(`/organization/events/${eventId}/cancel`, null);

export const deleteEvent = (id: string) => api.delete<void>(`/organization/events/${id}`);

export const publishEvent = (id: string, body: IPublishEventRequest) =>
  api.post<AxiosResponse<IMyEvent>>(`/organization/events/${id}/publish`, body);
