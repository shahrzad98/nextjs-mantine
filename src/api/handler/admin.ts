import { CustomAxiosResponse, IOrganizationListItem } from "@/types";

import { api } from "../apiClient";

export const getOrganizations = () =>
  api.get<CustomAxiosResponse<IOrganizationListItem[]>>("/admin/dashboard/organization-index");

export const searchOrganizations = (query: string) =>
  api.get<CustomAxiosResponse<IOrganizationListItem[]>>(
    `/admin/dashboard/organization-search?query=${query}`
  );

export const inviteOrganization = ({
  email,
  commission_percentage,
}: {
  email: string;
  commission_percentage: number;
}) =>
  api.post<CustomAxiosResponse<IOrganizationListItem>>("/admin/dashboard/create-organization", {
    email,
    commission_percentage,
  });

export const resendInviteOrganization = (id: string) =>
  api.get<CustomAxiosResponse<IOrganizationListItem>>(
    `/admin/dashboard/organizations/${id}/resend-organization-invite`
  );

export const updateOrganization = ({
  id,
  commission_percentage,
}: {
  commission_percentage: number;
  id: string;
}) =>
  api.put<CustomAxiosResponse<IOrganizationListItem>>(`/admin/dashboard/organizations/${id}`, {
    commission_percentage,
  });
