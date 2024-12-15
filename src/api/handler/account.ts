import { api } from "@/api/apiClient";
import { IOrganizationUser, IOrganizerAccountRequest } from "@/types";
import { AxiosResponse } from "axios";

export const getOrganizerMyAccount = () =>
  api.get<AxiosResponse<IOrganizationUser>>(`/organization/account/me`);

export const updateOrganizerMyAccount = (accountInfo: Partial<IOrganizerAccountRequest>) =>
  api.put<AxiosResponse<IOrganizationUser>>("/organization/account/me", accountInfo);
