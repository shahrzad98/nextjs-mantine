import { CustomAxiosResponse } from "@/types";
import { ITicketTierRequest, ITicketTierResponse } from "@/types/ticket";
import { AxiosResponse } from "axios";

import { api } from "../apiClient";

export const getTicketTiers = (eventId: string) =>
  api.get<CustomAxiosResponse<ITicketTierResponse[]>>(
    `/organization/events/${eventId}/ticket_tiers`
  );

export const createTicketTier = (eventId: string, ticketData: ITicketTierRequest) =>
  api.post<CustomAxiosResponse<ITicketTierResponse>>(
    `/organization/events/${eventId}/ticket_tiers`,
    ticketData
  );

export const editTicketTier = (
  eventId: string,
  ticketTierId: string,
  ticketData: ITicketTierRequest
) =>
  api.put<CustomAxiosResponse<ITicketTierResponse>>(
    `/organization/events/${eventId}/ticket_tiers/${ticketTierId}`,
    ticketData
  );

export const deleteTicketTier = (eventId: string, ticketTierId: string) =>
  api.delete<AxiosResponse>(`/organization/events/${eventId}/ticket_tiers/${ticketTierId}`);
