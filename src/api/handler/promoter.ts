import {
  CustomAxiosResponse,
  IEventPromoterDetails,
  IPagination,
  IPromoterAccountRequest,
  IPromoterUser,
} from "@/types";
import { IPromoterEvent, IPromoterInvitation, IPromoterPurchases } from "@/types/promoter";

import { api } from "../apiClient";

export const getInvitations = () =>
  api.get<CustomAxiosResponse<IPromoterInvitation[]>>("/promoter/dashboard/invitations");

export const updateInvitation = ({ status, id }: { status: string; id: string }) =>
  api.put<CustomAxiosResponse<IPromoterInvitation>>(`/promoter/dashboard/invitations/${id}`, {
    status,
  });

export const getPromoterEvents = (
  data?: IPagination & { organizationId?: string; query?: string }
) =>
  api.get<CustomAxiosResponse<IPromoterEvent[]>>(
    `/promoter/events?per_page=${data?.perPage}&page=${data?.page}${
      data?.organizationId ? `&organization_id=${data?.organizationId ?? ""}` : ""
    }${data?.query ? `&query=${data?.query ?? ""}` : ""}`
  );

export const getPromoterEvent = (id: string) =>
  api.get<CustomAxiosResponse<IPromoterEvent>>(`/promoter/events/${id}`);

export const getPromoterOrganizations = () =>
  api.get<
    CustomAxiosResponse<
      {
        id: string;
        name: string;
        slug: string;
      }[]
    >
  >(`/promoter/account/my-organizations`);

export const getPromoterMyAccount = () =>
  api.get<CustomAxiosResponse<IPromoterUser>>(`/promoter/account/me`);

export const updatePromoterMyAccount = (accountInfo: Partial<IPromoterAccountRequest>) =>
  api.put<CustomAxiosResponse<IPromoterUser>>("/promoter/account/me", accountInfo);

export const getPurchasesPerYear = (year: number) =>
  api.get<CustomAxiosResponse<IPromoterPurchases>>(
    `/promoter/dashboard/top-purchases?year=${year}`
  );

export const getPromoterEventDetails = ({ eventId }: { eventId: string }) =>
  api.get<CustomAxiosResponse<IEventPromoterDetails>>(`/promoter/events/${eventId}`);
