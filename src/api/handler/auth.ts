import {
  IAtttendeeAccountSetupRequest,
  ISSORequest,
  IOrganizatonSettings,
  IUserSignInRequest,
  IUserSignInResponse,
  IUserSignupRequest,
  IUserSignupResponse,
  IEmailConfirmationResponse,
  IAttendee,
} from "@/types/user";
import { AxiosResponse } from "axios";

import { api } from "../apiClient";

export const getGuestToken = () => api.get<AxiosResponse>(`/attendee/auth/guest-login`);

export const userLogin = ({
  email,
  password,
  variant,
  cart_token,
}: IUserSignInRequest & {
  variant: "attendee" | "organization" | "admin";
}): Promise<IUserSignInResponse> =>
  api.post<IUserSignInResponse>(`/${variant}/auth/login`, {
    email,
    password,
    platform: "PWA",
    cart_token,
  });

export const googleSSO = (return_to?: "checkout" | "mytickets" | "false") =>
  api.get<AxiosResponse<{ redirect_url: string }>>(
    `/attendee/auth/google?return_to=${return_to ? return_to : "false"}`
  );

export const facebookSSO = (return_to?: "checkout" | "mytickets" | "false") =>
  api.get<AxiosResponse<{ redirect_url: string }>>(
    `/attendee/auth/facebook?return_to=${return_to ? return_to : "false"}`
  );

export const ssoCallback = (query: ISSORequest, variant: "google" | "facebook") =>
  api.get<{ data: Partial<IAttendee> }>(
    `/attendee/auth/${variant}/callback?state=${query.state}&code=${query.code}&scope=${
      query.scope
    }&authuser=${query.authuser}&hd=${query.hd}&prompt=${query.prompt}&return_to=${
      query.return_to
    }&cart_token=${query?.cart_token || ""}`
  );

export const userLogout = ({ variant }: { variant: string }): Promise<AxiosResponse> =>
  api.delete<AxiosResponse>(`/${variant || "attendee"}/auth/logout`);

export const attendeeSignup = (values: IUserSignupRequest): Promise<IUserSignupResponse> =>
  api.post<IUserSignupResponse>(`/attendee/auth/register/step-one`, {
    ...values,
    platform: "PWA",
  });

export const attendeeAccountSetup = (values: IAtttendeeAccountSetupRequest) =>
  api.post(`/attendee/auth/register/step-two`, values);

export const attendeeVerifyMobile = (token: string) =>
  api.get(`/attendee/auth/verify-mobile/${token}`);

export const attendeeVerifyEmail = (token: string) =>
  api.get<AxiosResponse<IEmailConfirmationResponse>>(`/attendee/auth/verify-email/${token}`);

export const userForgotPassword = (email: string, variant: "attendee" | "organization") =>
  api.post(`/${variant}/auth/forgot-password`, { email });

export const userResetPassword = (
  reset_password_token: string,
  new_password: string,
  variant: "attendee" | "organization"
) => api.post(`/${variant}/auth/reset-password`, { reset_password_token, new_password });

export const userSetPassword = (
  token: string,
  new_password: string,
  variant: "organization" | "admin" | "promoter",
  role?: "owner" | "operator"
) => api.post(`/${variant}/auth/set-password`, { token, new_password, role });

export const operatorSetPassword = (reset_password_token: string, new_password: string) =>
  api.post(
    `/organization/auth/set-password
  `,
    { reset_password_token, new_password }
  );

export const getOrganizerSettings = () =>
  api.get<AxiosResponse<IOrganizatonSettings>>(`/organization/settings`);

export const updateOrganizerSettings = (values: Partial<IOrganizatonSettings>) =>
  api.put(`/organization/settings`, values);

export const checkOrganizationName = (name: string): Promise<{ data: string }> =>
  api.post(`/organization/settings/slug-generator`, { name });
