import {
  IOrganizationTeamMemberRequest,
  IMyEvent,
  IOrganizationAdmin,
  IOrganizationOperator,
  IOrganizationOwner,
  IOrganization,
  IOrganizationContactForm,
  IOrganizationStripeResponse,
  CustomAxiosResponse,
  IPagination,
  EventSalesMonth,
  IEventSalesYearResponse,
  TicketInsight,
  TicketSoldEvents,
  IEventAttendee,
  IEventPromoter,
  ITimezone,
  IOrganizationPromoterItem,
  IOrganizationPromoterEvent,
  IEventPromoterDetails,
} from "@/types";
import { AxiosResponse } from "axios";

import { api } from "../apiClient";

export const getTeamMembers = () =>
  api.get<CustomAxiosResponse<(IOrganizationAdmin | IOrganizationOwner | IOrganizationOperator)[]>>(
    "/organization/team"
  );

export const inviteTeamMember = (teamMember: IOrganizationTeamMemberRequest) =>
  api.post<CustomAxiosResponse<IOrganizationAdmin | IOrganizationOwner | IOrganizationOperator>>(
    "/organization/team/invite",
    teamMember
  );

export const deleteTeamMember = (id: string): Promise<unknown> =>
  api.delete<unknown>(`/organization/team/${id}`);

export const getMyEvents = (data?: IPagination & { status?: string }) =>
  api.get<CustomAxiosResponse<IMyEvent[]>>(
    `/organization/events?per_page=${data?.perPage}&page=${data?.page}&status=${data?.status ?? ""}`
  );

export const organizationSearchEvents = (data?: IPagination & { query?: string }) =>
  api.post<CustomAxiosResponse<IMyEvent[]>>(`/organization/events/search`, {
    per_page: data?.perPage,
    page: data?.page,
    query: data?.query,
  });

export const getEvent = (id: string) =>
  api.get<CustomAxiosResponse<IMyEvent>>(`/organization/events/${id}`);

export const getAttendeeList = (id: string, page: number, per_page: number) =>
  api.get<CustomAxiosResponse<IEventAttendee[]>>(
    `/organization/events/${id}/attendees?page=${page}&per_page=${per_page}`
  );

export const getPromotersList = () =>
  api.get<CustomAxiosResponse<IOrganizationPromoterItem[]>>(
    `/organization/promoters/all-promoters`
  );

export const getEventsPromotersList = (id: string) =>
  api.get<CustomAxiosResponse<IEventPromoter[]>>(`/organization/events/${id}/promoters`);

export const invitePromoter = ({
  eventId,
  email,
  commission_type,
  commission_amount,
  promoter_id,
}: {
  eventId: string;
  email?: string | null;
  commission_type: string;
  commission_amount: number;
  promoter_id?: string;
}) =>
  api.post<CustomAxiosResponse<IEventPromoter>>(`/organization/events/${eventId}/promoter-invite`, {
    email,
    commission_type,
    commission_amount,
    promoter_id,
  });

export const resendInvitePromoter = ({
  eventId,
  promoterId,
}: {
  eventId: string;
  promoterId: string;
}) =>
  api.get<CustomAxiosResponse<IEventPromoter>>(
    `/organization/events/${eventId}/promoters/${promoterId}/resend-invitation`
  );

export const updateEventPromoter = ({
  eventId,
  promoterId,
  commission_amount,
  commission_type,
}: {
  eventId: string;
  promoterId: string;
  commission_amount: number;
  commission_type: string;
}) =>
  api.put<CustomAxiosResponse<IEventPromoter>>(
    `/organization/events/${eventId}/promoters/${promoterId}`,
    {
      commission_amount,
      commission_type,
    }
  );

export const removeEventPromoter = ({
  eventId,
  promoterId,
}: {
  eventId: string;
  promoterId: string;
}) =>
  api.delete<CustomAxiosResponse<IEventPromoter>>(
    `/organization/events/${eventId}/promoters/${promoterId}`
  );

export const removeOrganizationPromoter = (promoterId: string) =>
  api.delete<CustomAxiosResponse<IOrganizationPromoterItem>>(
    `/organization/promoters/organization-promoters-events/${promoterId}`
  );

export const getOrganizationPromotersList = () =>
  api.get<CustomAxiosResponse<IOrganizationPromoterItem[]>>(
    `/organization/promoters/organization-promoters`
  );

export const getOrganizationPromotersEvents = (promoterId: string) =>
  api.get<CustomAxiosResponse<IOrganizationPromoterEvent[]>>(
    `/organization/promoters/organization-promoters-events/${promoterId}`
  );

export const getEventPromoterDetails = ({
  eventId,
  promoterId,
}: {
  eventId: string;
  promoterId: string;
}) =>
  api.get<CustomAxiosResponse<IEventPromoterDetails>>(
    `/organization/events/${eventId}/promoters/${promoterId}`
  );

export const getOrganization = (slug: string) =>
  api.get<CustomAxiosResponse<IOrganization>>(`/attendee/organization/${slug}`);

export const getOrganizationEvents = (slug: string, perPage: number, page: number) =>
  api.get<CustomAxiosResponse<IMyEvent[]>>(
    `/attendee/organization/${slug}/events?per_page=${perPage}&page=${page}`
  );

export const sendOrganizationContactRequest = (data: IOrganizationContactForm) =>
  api.post<CustomAxiosResponse<void>>(`/attendee/organization/for-organization-cta`, data);

export const stripeAccountOnboarding = () =>
  api.post<CustomAxiosResponse<IOrganizationStripeResponse>>(
    "/organization/stripe/account_onboarding",
    null
  );

export const stripeDashboard = () =>
  api.post<CustomAxiosResponse<IOrganizationStripeResponse>>(
    "/organization/stripe/account_login",
    null
  );

export const getSoldTickets = (page: number, perPage: number) =>
  api.get<CustomAxiosResponse<TicketSoldEvents>>(
    `/organization/dashboard/sold-tickets?page=${page}&per_page=${perPage}`
  );

export const getSalesPerYear = (year: number) =>
  api.get<CustomAxiosResponse<IEventSalesYearResponse>>(
    `/organization/dashboard/all-tickets-sold-chart?year=${year}`
  );

export const getSalesPerMonth = () =>
  api.get<CustomAxiosResponse<EventSalesMonth[]>>("/organization/dashboard/all-tickets-sold-list");

export const getTopEventsSold = () =>
  api.get<AxiosResponse<IMyEvent[]>>("/organization/dashboard/top-events");

export const getTicketInsights = () =>
  api.get<AxiosResponse<TicketInsight>>("/organization/dashboard/ticket-insights");

export const getTimezones = () =>
  api.get<AxiosResponse<ITimezone[]>>("/organization/settings/time-zones");
